import React from "react";
import Lottie from "lottie-react";
import "./CpuAnimationStyles.css";
import cpuUtilization from "../../Assets/cpuUtilizationAnimation.json";

function CpuUtilizationAnimation() {
  return (
    <div className="cpu-utilization-wrapper">
      <Lottie loop animationData={cpuUtilization} />
    </div>
  );
}
export default CpuUtilizationAnimation;
