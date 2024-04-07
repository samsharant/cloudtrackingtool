import React from "react";
import { Bar } from "react-chartjs-2";

const CostByInstance = ({ data }) => {
  // Sort the data by cost in descending order
  data.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));

  // Get the top 7 names with the highest cost
  const top7Data = data?.slice(0, 7);
  // Extract names and costs from the top 7 data
  const names = top7Data?.map((item) => item.name);
  const costs = top7Data?.map((item) => parseFloat(item.cost));
  const modifiedLabels = names.map((newser) =>
    newser?.length > 5 ? newser.substring(0, 5) + "..." : newser
  );

  const chartData = {
    labels: modifiedLabels,
    datasets: [
      {
        label: "Cost",
        data: costs,
        backgroundColor: "#E97451", // Bar color
        borderColor: "#E97451", // Border color
      },
    ],
  };

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Cost",
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
                text: "Instance Name(Top 7 Services by cost)",
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  const index = context.dataIndex;
                  const name = names[index] || "";
                  const cost = context.formattedValue || "";
                  return `${name} - $${cost}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CostByInstance;
