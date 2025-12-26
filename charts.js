const Charts = (() => {
  function buildLineChart(ctx, label, dataLabel, points, getX, getY) {
    const labels = points.map(getX);
    const data = points.map(getY);

    return new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: dataLabel,
          data,
          tension: 0.25,
          pointRadius: 0,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: { display: true, labels: { color: "#ffffff" } },
          title: { display: false }
        },
        scales: {
          x: { ticks: { color: "rgba(255,255,255,.65)" }, grid: { color: "rgba(255,255,255,.08)" } },
          y: { ticks: { color: "rgba(255,255,255,.65)" }, grid: { color: "rgba(255,255,255,.08)" } }
        }
      }
    });
  }

  function updateLineChart(chart, points, getX, getY) {
    chart.data.labels = points.map(getX);
    chart.data.datasets[0].data = points.map(getY);
    chart.update("none");
  }

  return { buildLineChart, updateLineChart };
})();
