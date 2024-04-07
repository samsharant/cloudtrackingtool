import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const BarChart = ({
    data,
    options,
    id
}) => {
    return (
        <Bar
            data={data}
            options={options}
            id={id}
        />
    )
}

export default BarChart;
