import { loadBase } from "./data.js";
import { $, toast } from "./ui.js";

export async function mountMap() {
  const host = $("#map");
  if (!host) return;

  const base = await loadBase();
  const details = $("#map-details");
  const modePill = $("#map-mode");

  let mode = "latency";

  const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
  svg.setAttribute("viewBox","0 0 100 70");
  svg.classList.add("mapsvg");

  // background
  const bg = document.createElementNS(svg.namespaceURI,"rect");
  bg.setAttribute("x","0"); bg.setAttribute("y","0"); bg.setAttribute("width","100"); bg.setAttribute("height","70");
  bg.setAttribute("fill","rgba(255,255,255,0.02)");
  svg.appendChild(bg);

  function lineColor(lat){
    if (lat < 110) return "rgba(0,229,255,0.9)";
    if (lat < 170) return "rgba(255,213,74,0.9)";
    return "rgba(255,77,109,0.9)";
  }

  // links
  base.regionLinks.forEach(l => {
    const a = base.regions.find(r => r.id === l.a);
    const b = base.regions.find(r => r.id === l.b);

    const p = document.createElementNS(svg.namespaceURI,"path");
    p.setAttribute("d", `M ${a.x} ${a.y} Q ${(a.x+b.x)/2} ${(a.y+b.y)/2 - 10} ${b.x} ${b.y}`);
    p.setAttribute("fill","none");
    p.setAttribute("stroke", lineColor(l.latency_ms));
    p.setAttribute("stroke-width","1.2");
    p.setAttribute("opacity","0.9");
    p.style.cursor = "pointer";
    p.addEventListener("click", () => {
      details.innerHTML = `
        <div><b>Лінк</b> ${a.name} ↔ ${b.name}</div>
        <div class="muted">Latency: ${l.latency_ms}ms</div>
        <div class="muted">Mode: ${mode}</div>
      `;
      toast("Карта", `${a.name} ↔ ${b.name}: ${l.latency_ms}ms`);
    });
    svg.appendChild(p);
  });

  // nodes
  base.regions.forEach(r => {
    const g = document.createElementNS(svg.namespaceURI,"g");
    g.style.cursor = "pointer";

    const c = document.createElementNS(svg.namespaceURI,"circle");
    c.setAttribute("cx", r.x); c.setAttribute("cy", r.y); c.setAttribute("r", 3.3);
    c.setAttribute("fill","rgba(53,255,155,0.95)");

    const halo = document.createElementNS(svg.namespaceURI,"circle");
    halo.setAttribute("cx", r.x); halo.setAttribute("cy", r.y); halo.setAttribute("r", 8);
    halo.setAttribute("fill","rgba(0,229,255,0.10)");

    const t = document.createElementNS(svg.namespaceURI,"text");
    t.setAttribute("x", r.x + 4.8);
    t.setAttribute("y", r.y - 4.5);
    t.setAttribute("fill","rgba(255,255,255,0.85)");
    t.setAttribute("font-size","3.3");
    t.textContent = r.name;

    g.appendChild(halo); g.appendChild(c); g.appendChild(t);

    g.addEventListener("click", () => {
      const traffic = Math.round(400 + Math.random()*800);
      const health = ["OK","Degraded","Down"][Math.floor(Math.random()*3)];
      details.innerHTML = `
        <div><b>Регіон</b> ${r.name}</div>
        <div class="muted">Traffic: ~${traffic} rps</div>
        <div class="muted">Health: ${health}</div>
        <div class="muted">Mode: ${mode}</div>
      `;
      toast("Регіон", `${r.name} • ${health}`);
    });

    svg.appendChild(g);
  });

  host.innerHTML = "";
  host.appendChild(svg);

  document.querySelectorAll("[data-mapmode]").forEach(btn => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mapmode;
      modePill.textContent = mode;
      toast("Карта", `Режим: ${mode}`);
    });
  });
}
