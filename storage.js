const Storage = (() => {
  const KEY = "dt.telemetry.v1";

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { points: [], events: [] };
      const parsed = JSON.parse(raw);
      return {
        points: Array.isArray(parsed.points) ? parsed.points : [],
        events: Array.isArray(parsed.events) ? parsed.events : []
      };
    } catch {
      return { points: [], events: [] };
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  function pushPoint(point, maxPoints = 600) {
    const state = load();
    state.points.push(point);
    if (state.points.length > maxPoints) state.points.splice(0, state.points.length - maxPoints);
    save(state);
    return state;
  }

  function pushEvent(evt, maxEvents = 120) {
    const state = load();
    state.events.push(evt);
    if (state.events.length > maxEvents) state.events.splice(0, state.events.length - maxEvents);
    save(state);
    return state;
  }

  return { load, save, clear, pushPoint, pushEvent, KEY };
})();
