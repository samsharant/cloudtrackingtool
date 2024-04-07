import React, { useEffect, useState } from "react";
import { Chart as ChartJS, registerables } from "chart.js";

const setupCharts = (
    amt,
    serviceData,
    totalCost,
    taggedCost
) => {
    ChartJS.register(
        ...registerables,
        {
          id: "textCenter",
          afterDatasetDraw(chart, args, pluginOptions) {
            if (
              chart.getDatasetMeta(0).type === "doughnut" &&
              chart.canvas.className === "dashboard-doughnut"
            ) {
              const { ctx, data } = chart;
              const x = chart.getDatasetMeta(0).data[0]?.x;
              const y = chart.getDatasetMeta(0).data[0]?.y;
  
              ctx.save();
              ctx.font = "lighter 20px sans-serif";
              ctx.fillStyle = "#273646";
              ctx.fillText("Top 5", x + 25, y - 30);
              ctx.fillText("Services Cost", x + 60, y - 5);
    
              const amount = amt; // Replace $x with the actual amount
              const numberOfCharacters = amount.toString().length;
              ctx.font = "bold 25px sans-serif";
              ctx.fillStyle = "#ff6f1a";
              const xOffset = x + 35 + (numberOfCharacters - 4) * 5;
              ctx.font = "bold 25px sans-serif";
              ctx.fillStyle = "#ff6f1a";
              ctx.fillText(`$${amount}`, xOffset, y + 30);
            }
            if (
              chart.getDatasetMeta(0).type === "doughnut" &&
              chart.canvas.className === "inventory-doughnut"
            ) {
              const { ctx, data } = chart;
              const x = chart.getDatasetMeta(0).data[0]?.x;
              const y = chart.getDatasetMeta(0).data[0]?.y;
  
              ctx.save();
              ctx.font = "lighter 15px sans-serif";
              ctx.fillStyle = "#273646";
              ctx.fillText("Total Cost", x+33, y - 15);
              const amount = totalCost; // Replace $x with the actual amount
              ctx.font = "bold 20px sans-serif";
              ctx.fillStyle = "#ff6f1a";
              ctx.fillText(`$${amount}`, x+30, y + 20);
            } 
          },
        },
        {
          id: "outsideLabels",
          afterDatasetsDraw: function (chart, args, options) {
            if (
              chart.getDatasetMeta(0).type === "doughnut" &&
              chart.canvas.className === "dashboard-doughnut"
            ) {
              var ctx = chart.ctx;
              var labels = chart.data.labels;
              var datasets = chart.data.datasets;
  
              datasets.forEach(function (dataset, datasetIndex) {
                var meta = chart.getDatasetMeta(datasetIndex);
                if (!meta.hidden) {
                  meta.data.forEach(function (element, index) {
                    // Draw the label outside the pie chart
                    if (element) {
                      const label = labels[index];
                      const total = Object.values(serviceData).reduce(
                        (curr, el) => curr + el,
                        0
                      );
                      const percent = (
                        (serviceData[label] / total) *
                        100
                      ).toFixed(1);
                      // console.log(label, percent)
                      var model = element;
                      var angle =
                        model.startAngle +
                        (model.endAngle - model.startAngle) / 2; // Middle angle of the slice
                      var radius = model.outerRadius;
                      var x = model.x + radius * Math.cos(angle);
                      var y = model.y + radius * Math.sin(angle);
                      if (index==1) y+=12;
                      if (index==4) {x+=6;y-=3;}
                      // Adjust label position based on angle
                      if (angle < Math.PI / 2 || angle > 1.5 * Math.PI) {
                        ctx.textAlign = "left";
                        x += 5; // Move label to the right
                      } else {
                        ctx.textAlign = "right";
                        x -= 3; // Move label to the left
                      }
  
                      ctx.fillStyle = "black";
                      ctx.font = "normal 10px sans-serif";
                      ctx.fillText(percent + "%", x, y);
                    }
                  });
                }
              });
            }
            if (
              chart.getDatasetMeta(0).type === "doughnut" &&
              chart.canvas.className === "inventory-doughnut"
            ) {
              var ctx = chart.ctx;
              var labels = chart.data.labels;
              var datasets = chart.data.datasets;
  
              datasets.forEach(function (dataset, datasetIndex) {
                var meta = chart.getDatasetMeta(datasetIndex);
                if (!meta.hidden) {
                  meta.data.forEach(function (element, index) {
                    // Draw the label outside the pie chart
                    if (element) {
                      const label = labels[index];
                      const percentageData = [
                        ((taggedCost / totalCost) * 100).toFixed(1),
                        (((totalCost - taggedCost) / totalCost) * 100).toFixed(1),
                      ];
                      const percent = percentageData[index];
                      var model = element;
                      var angle =
                        model.startAngle +
                        (model.endAngle - model.startAngle) / 2; // Middle angle of the slice
                      var radius = model.outerRadius;
                      var x = model.x + radius * Math.cos(angle);
                      var y = model.y + radius * Math.sin(angle);
                      // Adjust label position based on angle
                      if (angle < Math.PI / 2 || angle > 1.5 * Math.PI) {
                        ctx.textAlign = "left";
                        x += 5; // Move label to the right
                      } else {
                        ctx.textAlign = "right";
                        x -= 3; // Move label to the left
                      }
  
                      ctx.fillStyle = "black";
                      ctx.font = "normal 10px sans-serif";
                      ctx.fillText(percent + "%", x, y);
                    }
                  });
                }
              });
            }
          },
        }
      );
};

export default setupCharts;
