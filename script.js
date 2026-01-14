"use strict";

const startBtn = document.getElementById("startBtn");
const loadingBadge = document.getElementById("loadingBadge");

// (İstəyə bağlı) BOM: Browser Badging API
async function setBrowserBadge(n) {
  try {
    if ("setAppBadge" in navigator) await navigator.setAppBadge(n);
    else if ("setClientBadge" in navigator) await navigator.setClientBadge(n);
  } catch (_) {}
}
async function clearBrowserBadge() {
  try {
    if ("clearAppBadge" in navigator) await navigator.clearAppBadge();
    else if ("clearClientBadge" in navigator) await navigator.clearClientBadge();
  } catch (_) {}
}

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;

  // UI badge göstər
  loadingBadge.classList.remove("d-none");
  loadingBadge.classList.remove("text-bg-success");
  loadingBadge.classList.add("text-bg-warning");

  let pct = 0;

  // browser badge optional
  await setBrowserBadge(1);

  const t = setInterval(async () => {
    pct = Math.min(100, pct + 5);

    // Bootstrap badge text update
    loadingBadge.textContent = `Loading ${pct}%`;

    // 1-9 arası browser badge anim
    const badgeNum = Math.min(9, Math.max(1, Math.floor(pct / 12)));
    await setBrowserBadge(badgeNum);

    // Title (BOM)
    document.title = `Loading (${pct}%) — Pokemon Mini Game`;

    if (pct >= 100) {
      clearInterval(t);

      // success görünüş
      loadingBadge.classList.remove("text-bg-warning");
      loadingBadge.classList.add("text-bg-success");
      loadingBadge.textContent = "Loaded ✅";

      document.title = "Game — Pokemon Mini Game";
      await clearBrowserBadge();

      // 500ms sonra game səhifəsinə keç (BOM: setTimeout)
      setTimeout(() => {
        window.location.href = "game.html";
      }, 500);
    }
  }, 120);
});
