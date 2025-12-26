const Sim = (() => {
  // Генератор з базовими режимами:
  // normal: стабільно
  // overheat: температура росте
  // bearing: вібрація росте
  // shock: разовий спайк
  function makeGenerator({ mode = "normal", noise = 0.3 } = {}) {
    let t = 0;
    let baseTemp = 62;
    let baseVib = 4.2;
    let shockDone = false;

    function randN() {
      // шум - простий (не гаус)
      return (Math.random() - 0.5) * 2 * noise;
    }

    return function nextPoint() {
      t += 1;

      let temp = baseTemp + Math.sin(t / 7) * 1.2 + randN() * 2.2;
      let vib  = baseVib  + Math.sin(t / 9) * 0.25 + randN() * 0.6;

      if (mode === "overheat") {
        temp += Math.min(28, t * 0.35) + randN() * 1.0;
      }

      if (mode === "bearing") {
        vib += Math.min(6, t * 0.08) + Math.abs(randN()) * 0.5;
        temp += Math.min(10, t * 0.12) * 0.35;
      }

      if (mode === "shock" && !shockDone && t > 10) {
        // один “удар”
        vib += 6.5;
        temp += 8.5;
        shockDone = true;
      }

      // межі
      temp = Math.max(35, Math.min(110, temp));
      vib = Math.max(0.5, Math.min(15, vib));

      const ts = Date.now();
      const health = DT.computeHealth(temp, vib);

      return {
        ts,
        temp,
        vib,
        health
      };
    };
  }

  return { makeGenerator };
})();
