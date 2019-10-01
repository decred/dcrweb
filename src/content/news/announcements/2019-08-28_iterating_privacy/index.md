---
title: "Iterating Privacy"
date: 2019-08-28
author: "Jake Yocom-Piatt"
tags: ["Privacy", "Post-Quantum", "CoinShuffle++", "DiceMix", "Confidential transactions"]
type: "news-announcement"
layout: "article"
image: "iterating-privacy.png"
---

> Decred’s privacy features and plans are ready to be revealed. The goal of our privacy features is to be simple, adaptable, and creative.

Rather than take the routes established by privacy-focused projects, e.g. ring signatures, zk-SNARKs, or Mimblewimble, we decided to take a mixnet approach, where we have integrated the mixnet with our Proof-of-Stake (“PoS”) governance system. Currently, just over 50% of all decred in circulation participate in PoS, which requires a steady flow of ticket purchases. This existing transaction flow, unique to Decred, functions as the natural basis for a mixnet. Per the approach with Decred’s PoS governance system, this yields a “many birds, one stone” scenario: stakeholders gain anonymity and they simultaneously create a substantial background volume against which they and non-stakeholders can mix regular transactions. Here is a high level summary of Decred’s mixnet:

*   It is based on the CoinShuffle++ protocol from [“P2P Mixing and Unlinkable Bitcoin Transactions”](https://eprint.iacr.org/2016/824.pdf) by Ruffing, Moreno-Sanchez and Kate.
*   The mixing process is integrated with the ticket buying process, so stakeholders running ticket buying wallets can purchase tickets anonymously.
*   In addition to having a denomination based on the current ticket price, smaller fixed denominations are used for mixing change and regular transactions.
*   Change from the mixing process requires special handling to avoid linking unspent transaction outputs (“UTXOs”).
*   There is an approximately 12x increase in on-chain transaction storage when using privacy.
*   The initial release is command line interface (“CLI”) only and will only support solo stakers and non-stake transactions.

In the rest of this article, I will cover the motivation behind the decisions that were made to arrive at this system, how the system works in more detail, and what the next steps are after this initial release.

## Motivation

The privacy work has been kept under wraps since mid 2017, and this deserves some explanation. At the time, I had made the observation that both Monero and Zcash, while providing substantial privacy, had what I perceived as a serious problem: they cannot drop historical transactions from their full nodes, i.e. prune, because it is not possible to know if a transaction output (“TXO”) is spent or not. Although it is clear that both projects felt this was not a serious problem, my thought was that this is going to be a massive problem for sustainability in the longer term. A blockchain will struggle to function as a long-term store of value if it is too bloated to be downloaded and easily replicated, reducing its security. It appeared that most other people in the cryptocurrency space did not share this opinion, so I felt it best to withhold my criticism, rather than make it public and cue someone else to implement a solution.

Beyond this concern that breaking pruning was a bad long-term engineering decision that could negatively affect sustainability, despite being good for near-term privacy, I was concerned about the complexity of both approaches. Ring signatures carry a moderate complexity and zk-SNARKs have a high complexity, so that cued me to find a simpler approach that did not break pruning. Initially, I had planned to implement TumbleBit from the paper [“TumbleBit: An Untrusted Bitcoin-Compatible Anonymous Payment Hub”](https://eprint.iacr.org/2016/575.pdf) by Heilman, AlShenibr, Baldimtsi, Scafuro and Goldberg. Between the winter of 2017 and spring of 2018, I had Mikhail Belopuhov, a developer with substantial experience working on cryptographic engineering projects, implement TumbleBit in Go. Once his initial implementation was complete and it was time to integrate the code, I became more aware of the shortcomings of TumbleBit, namely that the mixing server is vulnerable to Denial-of-Service (“DoS”) attacks, and that the countermeasure against this (anonymous fee vouchers) meant more code and more complexity had to be added. Despite not integrating the TumbleBit code into Decred, we are [releasing this code](https://github.com/decred/tumblebit) for public benefit.

It was at this point that I thought it best to have a close look at the CoinShuffle++ protocol from [“P2P Mixing and Unlinkable Bitcoin Transactions”](https://eprint.iacr.org/2016/824.pdf) by Ruffing, Moreno-Sanchez and Kate, which I found to be substantially less complex than TumbleBit. CoinShuffle++ is based on common cryptographic primitives, e.g. key exchanges, session keys, hash functions, signatures, and finite field arithmetic. After having a close look at CoinShuffle++, it was clear it was simpler and more DoS-resistant than TumbleBit, so we pivoted and pursued CoinShuffle++. Simple code and simple primitives mean fewer things to break or go wrong. Due to constraints on engineering resources, this work did not start until December 2018, and it is now ready to be published after several months of work.

CoinShuffle++ addresses only the traceability component of privacy, without addressing the issue of transaction amounts. Since CoinShuffle++ did not require any consensus changes, this work was able to be completed in private. The same cannot be said for techniques to obfuscate transaction amounts. In order to obfuscate transaction amounts, consensus changes must occur, and those must occur as part of a public process with Decred, per the will of the stakeholders.

Decred is built on the tenets of blockchain security, built-in governance, and a self-funding block reward that makes it a superior store of value. With these foundations in place, we are keen to build out privacy features that will enhance security for our users. Despite a public process being required to obfuscate transaction amounts, I am of the opinion that the issue of traceability is far more important when it comes to the security of our stakeholders, who will experience a substantial privacy gain as a result.

## How It Works

Decred has [implemented a variant of CoinShuffle++](https://github.com/decred/cspp) in its wallet. Although it is possible to perform this process in an entirely peer-to-peer (“P2P”) fashion, that overlooks constraints that come from routing over the public internet, so we have created both a server, csppserver, and integrated the client into dcrwallet. In order to give a deeper understanding of how CoinShuffle++ works, we will work through a simple example that illustrates the concept behind the process. In addition to what is described in the paper, there is robust denomination and change handling built into wallet, and it is setup to handle both regular transactions and ticket purchasing. There are a couple notable limitations for this initial release since it is CLI only, requires a solo staking or non-staking configuration, and mixes can be undone by an attacker that can break the discrete logarithm problem (“DLP”). It is expected that roughly 12.5% of all decred in circulation will make use of privacy within a few months. Configuring dcrwallet to use privacy requires some configuration file editing.

### CoinShuffle++

CoinShuffle++ is a non-custodial process for creating CoinJoin transactions, where the output addresses are anonymized via a mixnet. The process whereby the output addresses are anonymized is called [DiceMix Light](https://github.com/ElementsProject/dicemix/blob/master/doc/protocol.md), which is an iteration by Ruffing of the DiceMix process originally proposed in the CoinShuffle++ paper. Note that the CoinJoin that occurs leaks which inputs and change addresses belong to which peer to the server, but not the other peers participating in the mix. The output addresses are fully anonymized, such that none of the peers or the server can tell which output belongs to which peer. Mixes occur episodically in epochs, with the initial mainnet epoch set to 20 minutes (1200 seconds).

### Architecture

The client-server architecture we chose is a common approach to network infrastructure, mainly because network address translation means you may not be able to directly reach other peers with whom you are mixing. This problem is very common and comes down to a question of port forwarding or whether UDP hole punching is an acceptable approach, which we believe adds too much complexity. Additionally, using direct P2P would mean every peer seeing every other peer’s public IP, which isn’t great for privacy. The server, csppserver, requires JSON-RPC access to dcrd, Decred’s consensus daemon, to verify TXOs are indeed unspent.

The initial csppserver will be hosted at cspp.decred.org, but it is possible to run your own server. Running your own server will have limited utility because the goal is to get as many peers as possible in each mix, so we recommend not doing it. There are plans to make the server high-availability in the future.

### Simplified DiceMix Example

In order to understand how the DiceMix protocol works, it is instructive to work through a simplified algorithm, called “Secure Sum”. This example uses 3 peers, but it is straightforward to extend this process to an arbitrary number of peers.

Assume Alice, Bob, and Carol each have a number and they want to compute the sum of all those numbers, but each of them wants to avoid any peer knowing what the other peers’ numbers are. Alice partitions her number as A1+A2+A3, Bob partitions his number as B1+B2+B3, and Carol partitions her number as C1+C2+C3\. Alice then sends A2 to Bob and A3 to Carol, Bob sends B1 to Alice and B3 to Carol, and Carol sends C1 to Alice and C2 to Bob. Alice calculates A1+B1+C1, Bob calculates A2+B2+C2, Carol calculates A3+B3+C3, then they all broadcast their respective partial sums to the other peers. Each of them can now calculate the sum of all the numbers by adding the partial sums, and no peer knows what each other peer’s number was, assuming there is no collusion.

The trick being used in the above example is that the sum of the horizontal sums equals the sum of the vertical sums, which is apparent if you write the partitions out:

<figure class="caption">![Secure Sum Example](/images/posts/dcr-secure-sum-example.png)</figure>

With DiceMix, additional complexity is added, but the core concept remains the same. DiceMix involves each peer creating a vector of the exponents of its payout address, adding padding terms to each vector component that are based on the pairwise session keys from the key exchange process, summing these vectors from each peer to create a system of equations, and then solving the system of equations for the payout addresses. The trick here is that the padding terms are chosen such that they cancel as they are summed across all peers’ vectors. Once we have an anonymized list of payout addresses, a standard CoinJoin process occurs with the peers.

### Denominations and Change Handling

DiceMix anonymizes the output addresses for a CoinJoin transaction, but it does not make the outputs indistinguishable. To make the outputs indistinguishable, they must have a fixed denomination for each mix. The need for fixed output denominations was noted in the [CryptoNote whitepaper](https://cryptonote.org/whitepaper_v1.pdf) in 2012, so the need for identical output amounts to preserve privacy is well-known. The denominations used for Decred are the current ticket price (plus a fee) and several fixed denominations below the ticket price. The ticket price changes every 144 blocks, roughly every 12 hours, so this denomination changes over time. If the ticket price changes during an epoch, the mix is cancelled and peers subscribe to the next mix.

As is typical in the world of cryptography and privacy “the devil is in the details”, and the change from CoinShuffle++ mixes is no exception to this rule. CoinShuffle++ does a fine job of anonymizing the output addresses, but if the change is not handled with care, it can link mixed and unmixed UTXOs. In many cases, change outputs can be linked to their inputs by doing a partial sum analysis, e.g. a subset of inputs sum to 12.34, an anonymous output of 10, fee of 0.001, and change of 2.339\. This means that if the change of 2.339 is included as an input with anonymized outputs, it creates a link between the inputs that sum to 12.34 and those anonymized outputs, reducing or entirely removing the privacy we have worked to create. To deal with this threat, change from mixes flows to a separate wallet account, where it is then mixed into smaller denominations until the change is less than the smallest mixer denomination.

The fixed denominations were chosen to balance the average on-chain transaction storage size, mix quality, and ease of performing multiplications. If we assume the denominations use base N and there are M denominations, in a worst case, there will be N-1 outputs from a given denomination, and M x (N - 1) total outputs from a single change input. For base 10, this means that a change amount of 99.999 would require up to 5 x (10 - 1) = 45 mixed outputs, so you can expect a roughly 22x increase in on-chain transaction storage. We have chosen to work in base 4, with 8 denominations below the ticket size, so a worst case change would require 8 x (4 - 1) = 24 outputs, creating a roughly 12x increase in on-chain storage. An extra 2 denominations above the ticket price have been included, but we expect them to receive limited usage. The smallest denomination is 4^9 atoms = 0.00262144 and the one below the current ticket size is 4^16 atoms = 42.94967296.

### Limitations

This initial code only supports the CLI wallet, dcrwallet, and solo stakers, i.e. does not work with voting service providers (“VSPs”), and regular transactions. We are obviously keen to extend support for privacy to GUI wallets, e.g. Decrediton, and have it work with VSPs. The challenge with GUI wallets is one of user experience (“UX”) since the process of mixing either freshly received payments or change requires the wallet to be unlocked for longer periods of time, e.g. 10s of minutes. VSPs create a more substantial challenge because users have a notion of identity when they register an account at a VSP, and each account has a fixed 1-of-2 multisignature script. In the event an attacker can break DLP and has passively recorded all the communications between the mix clients and the server, they can reveal the linking between the inputs, outputs and change. Note that there is no risk of such an attacker causing silent inflation.

### Expectations

An important aspect of any privacy feature is what users can expect to gain from it, particularly in the context of opt-in privacy. At the current ticket price of roughly DCR 128, steady state ticket buying requires our stakeholders to spend DCR 128 x 5 tickets per block x 288 blocks per day = DCR 184,320 per day. There are currently approximately DCR 10,282,000 in circulation, so this steady state buying represents roughly 1.8% of the total issuance being used to buy tickets each day. Roughly 50% of all tickets are solo staked, estimate that 50% of the solo stake will make use of privacy, and roughly 50% of all decred is staked, so that means an estimate of 12.5% of all decred will use privacy via this initial privacy release. It will likely take a few months for the participation to reach this level because tickets get called to vote slowly over time and only new tickets can opt-in to use privacy.

Both stakeholders and non-stakeholders can use the privacy system and be confident of a steady flow of transactions to mix with because we have integrated these transactions with the steady flow of ticket buying from our governance system. With the system described above, users who opt-in to privacy will be able to both receive and spend payments with healthy plausible deniability, and the situation will only improve as we improve the UX and increase the participation level. External passive observers will be able to see collections of mixed UTXOs be spent, but they will not able to link those transactions to an identity.

### Configuration

With all this talk about how privacy works, some readers are surely keen to get it configured and working. Several new options must be set in dcrwallet.conf:

*   csppserver=cspp.decred.org:15760 - This is the FQDN and port csppserver is listening on.
*   csppserver.ca=cspp.decred.org.pem - This is the CA certificate for the csppserver.
*   purchaseaccount=mixed - This sets the account from which you will buy tickets.
*   mixaccount=mixed/1 - As mixes occur, mixed output addresses will come from the internal branch this account.
*   changeaccount=unmixed - Each set of mix inputs uses a change address from this account.
*   mixchange=1 - This tells dcrwallet to mix payments to changeaccount into the mixedaccount.
*   ticketbuyer.votingaccount=voting - This tells the wallet which account to use when setting voting ticket voting addresses.

In addition to setting these new options in dcrwallet.conf, two new accounts must be created: mixed and unmixed. The voting account can either be created locally, if your ticketbuyer wallet also votes, or you can import an extended pubkey for a voting account from an external voting wallet.

Stakeholders running a ticketbuyer will want to [setup a 2nd ticketbuyer that will run in parallel](https://cspp.decred.org/), where the configurations are such that newly bought tickets in the 1st wallet have the 2nd wallet’s mixed account branch 0 set as their mixedaccount. It may take large stakeholders up to the full ticket expiration of roughly 4.7 months to completely migrate to the new mixed wallet. Non-stakeholders can set these options, leaving out purchaseaccount, and participate in the mixing without buying tickets. To receive payments, generate new addresses from the unmixed account, then those payments will be mixed into the mixed account.

Note that the mixing process requires the wallet being unlocked for longer periods of time, so that it can participate in a mix, which occurs every 20 minutes. Ticketbuyer wallets run unlocked already, but non-staking wallets will need to be left unlocked long enough to complete their mixes.

## Future Work

There is quite a bit of further work to be done to improve privacy, both in terms of improving upon and adding to the initial privacy release. The UX for GUI wallets, e.g. Decrediton, requires integration work both in the GUI components and dcrwallet. Retooling VSPs to be compatible with privacy requires going from an account-based system to a direct ticket-based system, and this requires modification of both dcrstakepool and dcrwallet. This initial release relies on a single server process, but we can replace this single server with either a cluster or a mixing mempool in dcrd. After seeing the complexity that arises from change handling, the addition of confidential transaction (“CT”) support would be a natural next step, which would require a consensus change. Since the mixing process does not occur on-chain, it is possible to modify DiceMix to support post-quantum (“PQ”) cryptography, which would make mixing secure against an attacker that can break DLP.

### GUI Wallet Integration

As mentioned above, there are some changes that must be made to dcrwallet so that the UX of mixing with Decrediton would be acceptable. The problem here is that an epoch on the order of 20 minutes requires a mixing wallet to be ready to sign the CoinJoin transaction for at least that amount of time. The simple option here is to leave the entire wallet unlocked for an extended period, but this is a bad security practice. With some work, it is possible to make dcrwallet unlock only a single account at a time, e.g. the unmixed account, and make all RPCs to the wallet that involves signing explicitly require the passphrase. Once these changes are made, integrating support for privacy into Decrediton should be straightforward.

### VSP Changes

VSPs currently operate on a per-account basis, e.g. you have a login, a fixed 1-of-2 multisignature address for that account, and a single set of voting preferences, but to support privacy properly, VSPs must operate on a per-ticket basis. This requires users to submit an individual private key per ticket to the VSP, VSP fees to be paid via direct payment, and ticket preferences set on a per-ticket basis. Additionally, it would be ideal if tickets were delegated to VSPs via Tor or similar. This requires changes to both dcrwallet and dcrstakepool. Since roughly 50% of the tickets are held by VSPs, this should translate to an approximate doubling of usage of privacy, from 12.5% to 25% of the decred in circulation.

### Mixer Server Clustering

It is simple to operate a single mixing server, but it is not a particularly resilient configuration, even though it is sufficient to handle a substantial transaction volume. A more resilient longer-term configuration would be a high availability cluster, or even integration of the server into dcrd, creating a mixing mempool. There may be reasons to not integrate this into dcrd, so further investigation is required here.

### Confidential Transactions

The complexity and on-chain transaction storage increase required to properly handle change with CoinShuffle++ is good motivation to consider adding obfuscation of transaction amounts. Obfuscating amounts causes the entire partial sum analysis and corresponding denomination-based mixing to become obsolete. This leads to a single mixing transaction per epoch, rather than several separate mixing transactions of various denominations. Conveniently, there is a paper [“Mixing Confidential Transactions: Comprehensive Transaction Privacy for Bitcoin”](https://fc17.ifca.ai/bitcoin/papers/bitcoin17-final6.pdf) by Ruffing and Moreno-Sanchez, which covers exactly this improvement. If Bulletproofs (“BPs”) are used, the size of transactions using CT is such that it is likely this will reduce on-chain transaction storage requirements.

A valid concern about CT is that an attacker that can break DLP can create silent inflation, which would be disastrous for Decred’s PoS governance system and its ability to server as a store of value. While there are valid arguments based on public information that a functioning large-scale quantum computer is still many years away, there is a massive incentive for larger nation state governments to develop such technology in secret and use it to decrypt a wide variety of encrypted data. The [BPs authors suggest in section 4.9](https://web.stanford.edu/~buenz/pubs/bulletproofs.pdf) it is possible to implement BPs that are computationally hiding and perfectly binding, rather than the simpler perfectly hiding and computationally binding BPs. We will be investigating this option because the failure mode of silent inflation would seriously damage Decred.

### Post-Quantum Cryptography

One of the major benefits of CoinShuffle++ and its associated DiceMix protocol is that it can be modified to support PQ cryptography, making the mixing process secure against attackers that can break DLP. DiceMix requires the participating peers to perform a pairwise key exchange, which they suggest be done as non-interactive key exchange for simplicity purposes because an interactive key exchange would create additional rounds of communication. By adding an additional round of communication, it is possible to use PQ cryptography to secure the key exchange process. Company 0 has [an existing implementation](https://github.com/companyzero/sntrup4591761) of one of the better PQ cryptosystems, Streamlined NTRU Prime 4591^761, based on [the work of Bernstein, Chuengsatiansup, Lange and van Vredendaal](https://ntruprime.cr.yp.to/ntruprime-20170816.pdf), so this would be a natural choice for such an application. Since the mixing process occurs off-chain, the typical transaction size considerations for using PQ cryptography are not relevant, e.g. that PQ public keys are often 1 KB or larger. Note that this would not prevent an attacker that can break DLP from stealing funds where the corresponding public key has been revealed, but it would prevent them from passively undoing mixes to strip privacy.

## Conclusion

It is refreshing to make this work public and deliver an initial release of privacy to our stakeholders in a way that can benefit all Decred users. These features are available as a dcrwallet pull request on GitHub, and we encourage the more technical users to test this code with us. This code has received substantial testing on testnet throughout its development, so it should be quite stable already. After some additional testing, this code will become part of the master branch and be included in the next release, 1.5.0\. We are always looking for talented developers, so if this privacy work interests you, hop in our [chat](https://chat.decred.org) and let us know.

While the work already completed is substantive, there is still much to do. We have aimed to keep the privacy code simple, both in terms of cryptographic primitives and its implicit constraints on the Decred blockchain. Decred will continue to iterate and adapt to the changing privacy landscape around us, integrating new features as necessary, per the will of the stakeholders, to deal with threats as they arise. As always, we strive to maximize the security of our blockchain and its users, and we will do it sustainably, to make Decred a superior long-term store of value.

In keeping with the previous privacy article, we have now added Decred to the chart below.

![Privacy Comparison Chart](dcr-cc-privacy-comparison-2.png)

