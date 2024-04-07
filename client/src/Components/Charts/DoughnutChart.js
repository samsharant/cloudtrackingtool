import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const DoughnutChart = ({
    data,
    options,
    width,
    height,
    className,
    id
}) => {
    return (
        <Doughnut
            data={data}
            options={options}
            width={width}
            height={height}
            className={className}
            id={id}
        />
    )
}

export default DoughnutChart;
