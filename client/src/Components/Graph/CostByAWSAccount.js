import React from "react";
import { Bar } from "react-chartjs-2";

const CostByAWSAccountChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.accountName), // X-axis labels (AWS account names)
    datasets: [
      {
        label: "Cost",
        data: data.map((item) => item.cost), // Y-axis data (cost)
        backgroundColor: "#F7A38E", // Bar color
        borderColor: "#F7A38E", // Border color
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
        x: {
          stacked: true, // Enable stacking on the x-axis
        },
        y: {
          stacked: true, // Enable stacking on the y-axis
          ticks: {
            callback: function (value, index, values) {
              return '$' + value;
            },
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
        title: {
          display: true,
          text: `Cost by AWS Accounts`,
        },
      },
  };

  return (
      <Bar data={chartData} options={options} />
  );
};

export default CostByAWSAccountChart;
