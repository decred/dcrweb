// Language switcher and mobile menu toggle.
//
// The set of supported languages, their display names, and direction (LTR/RTL)
// are all configured in src/config.yml. The Hugo template renders one <li> per
// translation; this script is only responsible for opening the dropdown and
// navigating to the chosen translation's permalink.

document.addEventListener("DOMContentLoaded", async () => {
  // ============================
  // Language dropdown
  // ============================
  const selectedLang = document.getElementById("selectedLang");
  const langList = document.getElementById("langList");

  if (selectedLang && langList) {
    selectedLang.addEventListener("click", () => {
      langList.classList.toggle("hidden");
    });

    document.querySelectorAll("#langList li").forEach((item) => {
      item.addEventListener("click", function () {
        const href = this.getAttribute("data-href");
        if (href) {
          window.location.href = href;
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!selectedLang.contains(e.target) && !langList.contains(e.target)) {
        langList.classList.add("hidden");
      }
    });
  }

  // ============================
  // Mobile menu toggle
  // ============================
  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      const mainmenu = document.querySelector(".mainmenu");
      if (mainmenu) {
        mainmenu.classList.toggle("show");
      }
    });
  }

  // ============================
  // Hero scroll cue collision guard
  // ============================
  const adjustHeroScrollCue = () => {
    const cue = document.querySelector(".hero-scroll-cue");
    const desc = document.querySelector(".banner .desc");

    if (!cue || !desc) {
      return;
    }

    cue.style.transform = "";

    if (window.getComputedStyle(cue).position !== "absolute") {
      return;
    }

    const minGap = 24;
    const gap = cue.getBoundingClientRect().top - desc.getBoundingClientRect().bottom;

    if (gap < minGap) {
      cue.style.transform = `translateY(${Math.ceil(minGap - gap)}px)`;
    }
  };

  let heroScrollCueFrame = null;
  const scheduleHeroScrollCueAdjustment = () => {
    if (heroScrollCueFrame) {
      cancelAnimationFrame(heroScrollCueFrame);
    }
    heroScrollCueFrame = requestAnimationFrame(adjustHeroScrollCue);
  };

  scheduleHeroScrollCueAdjustment();
  window.addEventListener("resize", scheduleHeroScrollCueAdjustment);
  window.addEventListener("load", scheduleHeroScrollCueAdjustment, { once: true });

  if (document.fonts) {
    document.fonts.ready.then(scheduleHeroScrollCueAdjustment);
  }

  // ============================
  // Sidebar stats
  // ============================
  const API = "https://api.decred.org";

  try {
    // First API call
    const webinfoResponse = await fetch(`${API}/api?c=webinfo`);
    const webinfo = await webinfoResponse.json();

    const supply = webinfo.circulatingsupply;

    const formatted = supply >= 1e6 ? (supply / 1e6).toFixed(0) + "M" : supply.toLocaleString("en-US");

    document.querySelectorAll('[data-stat-name="formatted"]').forEach(el => {
      el.innerHTML = formatted;
    });

    console.log("Web Info:", webinfo);

    var mined = Math.round(100 * (webinfo.circulatingsupply / webinfo.ultimatesupply));
    document.querySelectorAll('[data-stat-name="coins-mined"]').forEach(el => {
      el.innerHTML = mined + "%";
    });

    // Percentage staked.
    var staked = Math.round(100 * (webinfo.stakedsupply / webinfo.circulatingsupply));
    document.querySelectorAll('[data-stat-name="total-staked"]').forEach(el => {
      el.innerHTML = staked + "%";
    });

    // Staking APR — annualized ticket reward. The API has no APR field, so it is
    // derived from the block subsidy and ticket price using Decred protocol constants.
    const TICKETS_PER_BLOCK = 5;       // votes (and ticket rewards) paid per block
    const TARGET_POOL_SIZE = 40960;    // target live ticket pool (TicketPoolSize 8192 * 5)
    const BLOCKS_PER_DAY = 288;        // ~5-minute blocks
    const POS_SUBSIDY_SHARE = 0.89;    // PoS share of the subsidy (DCP0010: 1% PoW / 89% PoS / 10% treasury)

    var stakeRewardPerVote = (webinfo.blockreward * POS_SUBSIDY_SHARE) / TICKETS_PER_BLOCK;
    var meanBlocksToVote = TARGET_POOL_SIZE / TICKETS_PER_BLOCK; // ~8192 blocks (~28.4 days)
    var votesPerYear = (BLOCKS_PER_DAY * 365.25) / meanBlocksToVote;
    var apr = (stakeRewardPerVote / webinfo.ticketprice) * votesPerYear * 100;

    document.querySelectorAll('[data-stat-name="staking-apr"]').forEach(el => {
      el.innerHTML = apr.toFixed(1) + "%";
    });

    // Second API call
    const priceResponse = await fetch(`${API}/api?c=price`);
    const priceinfo = await priceResponse.json();

    console.log("Price Info:", priceinfo);

    // Print both together
    console.log("Combined Data:", {
      webinfo,
      priceinfo
    });

  } catch (error) {
    console.error("API Error:", error);
  }
});
