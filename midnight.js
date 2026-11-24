(() => {
  "use strict";
  // Fixed Indian Standard Time, independent of the visitor's time zone.
  const unlockAt = Date.parse("2026-12-10T00:00:00+05:30");
  const gate = document.getElementById("midnight-gate");
  const template = document.getElementById("love-site");
  let started = false;
  let timer;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.append(script);
    });
  }
  async function unlock() {
    if (started) return;
    started = true;
    clearInterval(timer);
    document.getElementById("gate-status").textContent = "Your surprise is ready. With all my love…";
    const mount = document.createElement("div");
    mount.id = "love-site-content";
    mount.hidden = true;
    mount.append(template.content.cloneNode(true));
    gate.after(mount);
    try {
      await loadScript("config.js");
      // Show the original content before its scripts handle direct chapter links.
      mount.hidden = false;
      gate.hidden = true;
      await loadScript("script.js");
      await loadScript("ultimate.js");
      gate.remove();
      template.remove();
      if (!location.hash) window.scrollTo(0, 0);
    } catch (error) {
      mount.hidden = true;
      gate.hidden = false;
      document.getElementById("gate-status").textContent = "Your surprise is ready, but could not load. Please refresh the page.";
      console.error(error);
    }
  }
  function tick() {
    if (started) return;
    const remaining = unlockAt - Date.now();
    if (remaining <= 0) {
      for (const key of ["days", "hours", "minutes", "seconds"]) document.getElementById("gate-" + key).textContent = "00";
      unlock();
      return;
    }
    const seconds = Math.ceil(remaining / 1000);
    const parts = [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
    ["days", "hours", "minutes", "seconds"].forEach((key, i) => document.getElementById("gate-" + key).textContent = String(parts[i]).padStart(2, "0"));
  }
  timer = setInterval(tick, 250);
  window.addEventListener("pageshow", tick);
  document.addEventListener("visibilitychange", tick);
  tick();
})();
