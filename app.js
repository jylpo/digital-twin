(() => {
  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Home KPIs
  UI.setText("kpiObjects", DT?.demoConfig?.objects ?? "—");
  UI.setText("kpiSignals", DT?.demoConfig?.signals ?? "—");
  UI.setText("kpiTick", (DT?.demoConfig?.tickSec ?? "—") + "");

  // Highlight active nav (fallback, якщо десь не поставив is-active)
  const path = location.pathname.split("/").pop() || "index.html";
  UI.$all(".nav__link").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("is-active");
  });
})();
