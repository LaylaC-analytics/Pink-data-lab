fetch("data.json")
  .then(response => response.json())
  .then(data => {

    const dashboardData = data.pink_data_insights;

    const regionFilter = document.getElementById("regionFilter");
    const toggleButton = document.getElementById("toggleChart");
    const totalRevenueElement = document.getElementById("total-revenue");

    let currentChartType = "bar";
    let productChart;
    let regionChart;

    const totalRevenue = dashboardData.total_revenue;

    /* ================= PALETA PASTEL ================= */

    const regionColors = {
      "North": "#F8A5C2",   // pastel pink
      "West": "#A0E7E5",    // pastel aqua
      "South": "#B4F8C8",   // pastel mint
      "East": "#D5AAFF"     // pastel lilac
    };

    const productColors = [
      "#F9C5D1",  // soft rose
      "#CDB4DB",  // soft lavender
      "#BDE0FE"   // soft blue
    ];

    /* ================= POPULAR REGIONS ================= */

    dashboardData.revenue_by_region.forEach(region => {
      const option = document.createElement("option");
      option.value = region.region;
      option.textContent = region.region;
      regionFilter.appendChild(option);
    });

    /* ================= KPI ================= */

    function updateKPI(regionName = "all") {

      if (regionName === "all") {
        totalRevenueElement.textContent =
          totalRevenue.toLocaleString();
        return;
      }

      const region = dashboardData.revenue_by_region
        .find(r => r.region === regionName);

      const percentage = ((region.value / totalRevenue) * 100).toFixed(1);

      totalRevenueElement.textContent =
        `${region.value.toLocaleString()} (${percentage}%)`;
    }

    updateKPI();

    /* ================= PRODUCT CHART ================= */

    function createProductChart(type) {

      const ctx = document
        .getElementById("productChart")
        .getContext("2d");

      if (productChart) productChart.destroy();

      productChart = new Chart(ctx, {
        type: type,
        data: {
          labels: dashboardData.revenue_by_product.map(p => p.product),
          datasets: [{
            label: "Revenue",
            data: dashboardData.revenue_by_product.map(p => p.value),
            backgroundColor: productColors,
            borderColor: "#ffffff",
            borderWidth: 2,
            tension: 0.4,
            fill: type === "line"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 1000 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Revenue: ${context.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    createProductChart(currentChartType);

    toggleButton.addEventListener("click", () => {
      currentChartType = currentChartType === "bar" ? "line" : "bar";
      createProductChart(currentChartType);
    });

    /* ================= PLUGIN TEXTO CENTRAL ================= */

    const centerTextPlugin = {
      id: "centerText",
      beforeDraw(chart) {

        if (chart.config.type !== "doughnut") return;

        const { width } = chart;
        const { height } = chart;
        const ctx = chart.ctx;

        ctx.restore();

        const dataset = chart.data.datasets[0];
        const total = dataset.data.reduce((a, b) => a + b, 0);

        if (dataset.data.length === 1) {

          const percentage = ((dataset.data[0] / totalRevenue) * 100).toFixed(1) + "%";

          ctx.font = "bold 24px Poppins";
          ctx.fillStyle = "#555";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(percentage, width / 2, height / 2);
        }

        ctx.save();
      }
    };

    Chart.register(centerTextPlugin);

    /* ================= REGION CHART ================= */

    function createRegionChart(labels, values) {

      const ctx = document
        .getElementById("regionChart")
        .getContext("2d");

      if (regionChart) regionChart.destroy();

      const backgroundColors = labels.map(label => regionColors[label]);

      regionChart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: backgroundColors,
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 15
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          animation: { duration: 800 },
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: function(context) {

                  const value = context.raw;
                  const percentage = ((value / totalRevenue) * 100).toFixed(1);

                  return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    createRegionChart(
      dashboardData.revenue_by_region.map(r => r.region),
      dashboardData.revenue_by_region.map(r => r.value)
    );

    /* ================= REGION FILTER ================= */

    regionFilter.addEventListener("change", () => {

      const selected = regionFilter.value;

      if (selected === "all") {

        updateKPI("all");

        createRegionChart(
          dashboardData.revenue_by_region.map(r => r.region),
          dashboardData.revenue_by_region.map(r => r.value)
        );

      } else {

        const region = dashboardData.revenue_by_region
          .find(r => r.region === selected);

        updateKPI(selected);

        createRegionChart(
          [region.region],
          [region.value]
        );
      }

    });

  })
  .catch(error => console.error("Erro ao carregar JSON:", error));