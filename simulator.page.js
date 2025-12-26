(() => {
  const modeEl = UI.$("#mode");
  const intervalEl = UI.$("#interval");
  const durationEl = UI.$("#duration");
  const noiseEl = UI.$("#noise");

  const startBtn = UI.$("#start");
  const stopBtn = UI.$("#stop");
  const resetBtn = UI.$("#reset");

  const liveTemp = UI.$("#liveTemp");
  const liveVib = UI.$("#liveVib");
  const liveStatus = UI.$("#liveStatus");

  if (!startBtn) return; // не на цій сторінці

  let timer = null;
  let generator = null;
  let ticksLeft = 0;

  function setRunning(running) {
    startBtn.disabled = running;
    stopBtn.disabled = !running;
    modeEl.disabled = running;
    intervalEl.disabled = running;
    durationEl.disabled = running;
    noiseEl.disabled = running;
  }

  function statusFromPoint(p) {
    const a = DT.detectAlerts(p);
    if (a.some(x => x.level === "crit")) return "CRITICAL";
    if (a.some(x => x.level === "warn")) return "WARNING";
    return "OK";
  }

  function push(p) {
    Storage.pushPoint(p);

    // алерти/події
    const alerts = DT.detectAlerts(p);
    alerts.forEach(al => {
      Storage.pushEvent({
        ts: al.ts,
        level: al.level,
        title: al.title,
        desc: al.desc
      });
    });

    liveTemp.textContent = p.temp.toFixed(1) + " °C";
    liveVib.textContent = p.vib.toFixed(2) + " мм/с";
    const st = statusFromPoint(p);
    liveStatus.textContent = st;
  }

  function start() {
    const mode = modeEl.value;
    const intervalSec = Math.max(0.5, Number(intervalEl.value) || 1);
    const durationSec = Math.max(10, Number(durationEl.value) || 60);
    const noise = Math.max(0, Math.min(1, Number(noiseEl.value) || 0.3));

    generator = Sim.makeGenerator({ mode, noise });
    ticksLeft = Math.floor(durationSec / intervalSec);

    setRunning(true);
    push(generator()); // перша точка одразу

    timer = setInterval(() => {
      if (ticksLeft <= 0) return stop();
      ticksLeft -= 1;
      push(generator());
    }, intervalSec * 1000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    setRunning(false);
  }

  function reset() {
    Storage.clear();
    liveTemp.textContent = "—";
    liveVib.textContent = "—";
    liveStatus.textContent = "—";
  }

  startBtn.addEventListener("click", start);
  stopBtn.addEventListener("click", stop);
  resetBtn.addEventListener("click", reset);
})();
