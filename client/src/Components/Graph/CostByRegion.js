// src/components/CostChart.js
import React from "react";
import { Bar } from "react-chartjs-2";

const CostByRegion = ({ data }) => {
  const regions = [...new Set(data.map((item) => item.region.region_name))];

  // Calculate total costs for each region
  const totalCosts = regions.map((region) => {
    return data
      .filter((item) => item.region.region_name === region)
      .reduce((total, item) => total + parseFloat(item.cost), 0);
  });

  // Combine regions and total costs and sort them in descending order
  const sortedData = regions
    .map((region, index) => ({
      region,
      totalCost: totalCosts[index],
    }))
    .sort((a, b) => b.totalCost - a.totalCost);

  // Separate the sorted data back into regions and total costs
  const sortedRegions = sortedData.map((item) => item.region);
  const sortedTotalCosts = sortedData.map((item) => item.totalCost);
  const modifiedLabels = sortedRegions.map((newser) =>
    newser.length > 5 ? newser.substring(0, 5) + "..." : newser
  );

  const chartData = {
    labels: modifiedLabels,
    datasets: [
      {
        label: "Total Cost",
        data: sortedTotalCosts,
        backgroundColor: "#5c8fc4",
        borderColor: "#5c8fc4",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Cost",
        },
        stacked: true, // Enable stacking on the y-axis
        ticks: {
          callback: function (value, index, values) {
            return "$" + value;
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Region Name",
        },
      },
    },
    plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const sortedRegion = sortedRegions[index] || "";
                  const cost = context.formattedValue || "";
                  return `${sortedRegion} - $${cost}`;
                },
              },
            },
          },
  };

  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default CostByRegion;
