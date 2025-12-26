(() => {
  const btnClear = UI.$("#btnClear");
  const eventsEl = UI.$("#events");

  const kpiTemp = UI.$("#kpiTemp");
  const kpiVib = UI.$("#kpiVib");
  const kpiHealth = UI.$("#kpiHealth");
  const kpiAlerts = UI.$("#kpiAlerts");
  const kpiTempHint = UI.$("#kpiTempHint");
  const kpiVibHint = UI.$("#kpiVibHint");

  const cTemp = UI.$("#chartTemp");
  const cVib = UI.$("#chartVib");
  const cHealth = UI.$("#chartHealth");

  if (!cTemp) return; // не на цій сторінці

  let chartTemp, chartVib, chartHealth;

  function hintTemp(temp) {
    if (temp >= DT.thresholds.tempCrit) return "CRIT: перегрів";
    if (temp >= DT.thresholds.tempWarn) return "WARN: вище норми";
    return "OK: норма";
  }
  function hintVib(vib) {
    if (vib >= DT.thresholds.vibCrit) return "CRIT: сильна вібрація";
    if (vib >= DT.thresholds.vibWarn) return "WARN: зростає";
    return "OK: стабільно";
  }

  function renderEvents(events) {
    if (!eventsEl) return;
    if (!events.length) {
      eventsEl.innerHTML = `<div class="event"><div class="event__title">Поки що немає подій</div><div class="event__desc">Запусти симулятор, щоб згенерувати дані.</div></div>`;
      return;
    }

    eventsEl.innerHTML = events.slice().reverse().map(e => {
      const cls = e.level !== "ok" ? "event event--warn" : "event";
      return `
        <div class="${cls}">
          <div class="event__time">${UI.fmtTime(e.ts)}</div>
          <div class="event__title">${e.title}</div>
          <div class="event__desc">${e.desc}</div>
        </div>
      `;
    }).join("");
  }

  function getRecentAlertsCount(events) {
    const now = Date.now();
    return events.filter(e => (now - e.ts) <= 60_000 && (e.level === "warn" || e.level === "crit")).length;
  }

  function refresh(init = false) {
    const state = Storage.load();
    const points = state.points || [];
    const events = state.events || [];

    const last = points[points.length - 1];
    if (last) {
      kpiTemp.textContent = last.temp.toFixed(1) + "°C";
      kpiVib.textContent = last.vib.toFixed(2) + " мм/с";
      kpiHealth.textContent = last.health + " / 100";
      kpiTempHint.textContent = hintTemp(last.temp);
      kpiVibHint.textContent = hintVib(last.vib);
    } else {
      kpiTemp.textContent = "—";
      kpiVib.textContent = "—";
      kpiHealth.textContent = "—";
      kpiTempHint.textContent = "—";
      kpiVibHint.textContent = "—";
    }

    kpiAlerts.textContent = String(getRecentAlertsCount(events));
    renderEvents(events);

    const view = points.slice(-60); // останні 60 точок
    const x = p => UI.fmtTime(p.ts);

    if (init) {
      chartTemp = Charts.buildLineChart(cTemp.getContext("2d"), "Temp", "Temperature (°C)", view, x, p => p.temp);
      chartVib = Charts.buildLineChart(cVib.getContext("2d"), "Vib", "Vibration (мм/с)", view, x, p => p.vib);
      chartHealth = Charts.buildLineChart(cHealth.getContext("2d"), "Health", "Health Index", view, x, p => p.health);
    } else {
      if (chartTemp) Charts.updateLineChart(chartTemp, view, x, p => p.temp);
      if (chartVib) Charts.updateLineChart(chartVib, view, x, p => p.vib);
      if (chartHealth) Charts.updateLineChart(chartHealth, view, x, p => p.health);
    }
  }

  btnClear?.addEventListener("click", () => {
    Storage.clear();
    refresh(false);
  });

  refresh(true);
  setInterval(() => refresh(false), 1000);
})();
