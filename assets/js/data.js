const DT = (() => {
  const demoConfig = {
    objects: 1,
    signals: 2,
    tickSec: 1
  };

  // Пороги (для алертів)
  const thresholds = {
    tempWarn: 78,
    tempCrit: 88,
    vibWarn: 7.2,
    vibCrit: 9.0
  };

  // Простий “Health Index” (0..100) на правилах:
  // базово 100, штрафи за перевищення порогів.
  function computeHealth(temp, vib) {
    let health = 100;

    // Температура
    if (temp > thresholds.tempWarn) health -= Math.min(35, (temp - thresholds.tempWarn) * 2.2);
    if (temp > thresholds.tempCrit) health -= 18;

    // Вібрація
    if (vib > thresholds.vibWarn) health -= Math.min(35, (vib - thresholds.vibWarn) * 8);
    if (vib > thresholds.vibCrit) health -= 18;

    health = Math.max(0, Math.min(100, Math.round(health)));
    return health;
  }

  // Перевірка алертів
  function detectAlerts(point) {
    const alerts = [];
    const { temp, vib, ts } = point;

    if (temp >= thresholds.tempCrit) {
      alerts.push({ level: "crit", title: "Критичний перегрів", desc: `t°=${temp.toFixed(1)}°C`, ts });
    } else if (temp >= thresholds.tempWarn) {
      alerts.push({ level: "warn", title: "Підвищена температура", desc: `t°=${temp.toFixed(1)}°C`, ts });
    }

    if (vib >= thresholds.vibCrit) {
      alerts.push({ level: "crit", title: "Критична вібрація", desc: `v=${vib.toFixed(2)} мм/с`, ts });
    } else if (vib >= thresholds.vibWarn) {
      alerts.push({ level: "warn", title: "Підвищена вібрація", desc: `v=${vib.toFixed(2)} мм/с`, ts });
    }

    return alerts;
  }

  return { demoConfig, thresholds, computeHealth, detectAlerts };
})();
