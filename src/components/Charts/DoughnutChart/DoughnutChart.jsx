import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required components for the chart
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({
  chartData,
  question_id,
  chartOptions,
  width = 40,
  height = 40,
  centerText = 0,
  isActive,
  handleClick,
}) => {
  // Define the custom plugin to display text at the center

  return (
    <div
      className={`relative rounded-full h-fit w-fit ${isActive ? 'border-primary-500 border-4 ' : null}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={() => handleClick(question_id)}
    >
      {/* <div className="absolute right-[42%] bottom-[21%]  ">{'1'}</div> */}
      <Doughnut data={chartData} options={chartOptions} width={40} height={40} />
    </div>
  );
};
export default React.memo(DoughnutChart);
