import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

const LineChart = ({
    data,
    options,
    width,
    height,
    id
}) => {
    return (
        <Line
            data={data}
            options={options}
            width={width}
            height={height}
            id={id}
        />
    )
}

export default LineChart;
