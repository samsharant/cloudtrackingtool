import React from "react";
import { Bar } from "react-chartjs-2";

const ServiceCostChart = ({ data }) => {
  // Extract service names and total costs from the JSON data
  const serviceData = data.reduce((accumulator, entry) => {
    entry.data.forEach((service) => {
      const serviceName = service.Service;
      const totalCost = service.TotalCost;
      accumulator[serviceName] = (accumulator[serviceName] || 0) + totalCost;
    });
    return accumulator;
  }, {});

  // Filter out services with zero cost
  const filteredServiceData = Object.entries(serviceData)
    .filter(([serviceName, totalCost]) => totalCost > 10)
    .reduce((accumulator, [serviceName, totalCost]) => {
      accumulator[serviceName] = totalCost;
      return accumulator;
    }, {});

  const serviceNames = Object.keys(filteredServiceData);
  const totalCosts = Object.values(filteredServiceData);
  const modifiedServiceLabels = serviceNames.map((newser) =>
    newser.length > 5 ? newser.substring(0, 5) + "..." : newser
  );

  const chartData = {
    labels: modifiedServiceLabels,
    datasets: [
      {
        label: "Total Cost",
        data: totalCosts.map((cost) => cost.toFixed(2)),
      },
    ],
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Cost",
        },
        ticks: {
          callback: function (value, index, values) {
            return "$" + value;
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const serviceName = serviceNames[index] || "";
            const cost = context.formattedValue || "";
            return `${serviceName} - $${cost}`;
          },
        },
      },
      title: {
        display: true,
        text: `Top service by cost for past 3 months`,
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default ServiceCostChart;

