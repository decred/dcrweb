# Security

Network security is foundational to any financial system. Agreement on transactions and account balances, also known as consensus, it vital to confidence in the currency and can be measured by both longevity and analysis of its resistance to various attack vectors.

## Imperfect Systems

In peer-to-peer financial systems, Proof-of-Work solved the double spending problem. It has proved its worth for more than a decade, but is energy intensive and susceptible to majority attacks. Proof-of-Stake was developed to avoid those issues through alignment of interests, but it came with its own shortcomings, most notably the nothing at stake problem.

***********************************************
Use this as a graphic on the side:
Proof-of-Work
An Imperfect Solution
•Energy & machine intensive
•51% attacks: Re-write history, enable theft of funds

Proof-of-Stake
•Nothing at stake: Stakers can forge multiple chains
•Crypto derivatives: Shorting incentivizes bad behavior
•Feudalistic: Stakers maintain their relative wealth
•More centralized: Fewer network participants
***********************************************

### Decredʼs Hybrid Solution

Decred employs a combination of PoW and PoS to yield the best of both systems,
mitigate their weaknesses, and deliver a layered consensus mechanism that
makes it far more secure than other cryptocurrencies. Decred uses conventional PoW,
typically mined by ASICs using the Blake-256 hash algorithm, for which it is
dominant. Decred holders time-lock their funds to purchase tickets. Those tickets are added to a pool of roughly 41,000 tickets, and five tickets are pseudorandomly selected to validate the proof-of-work for each block. If at least 50% of the tickets approve the work of the miner, the block reward for the previous block is approved.

#### Resistance to Attacks

Because a block must include 3 or more ticket votes to be valid, blocks must be broadcast on the network as they are mined for the chain to proceed, so miners cannot mine in secret. The result is that an attacker must have a considerable combination of hashpower and stake to successfully execute a majority attack. Decred voters are also set to reject a re-org of greater than 6 blocks, so any attack involving a deep re-org is unlikely to be accepted by the network. When comparing the cost of an attack on a pure PoW cryptocurrency, the cost to attack Decred is an order of magnitude greater, plus any attacker with stake would be taking actions counter to their interests.
