import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required components for the chart
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ chartData, question_id, chartOptions, width = 40, height = 40, centerText = 0, isActive, handleClick }) => {
  // Define the custom plugin to display text at the center

  // Merge the custom plugin into the options
  const optionsWithCenterText = {
    ...chartOptions,
    animation: {
      onComplete: (context) => {
        const chart = context?.chart;
        const { ctx } = chart;
        ctx.save();

        const centerX = chart?.width / 2;
        const centerY = chart?.height / 2;

        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.textBaseline = 'top';
        ctx.fillText(centerText, centerX, centerY - 5);

        ctx.restore();
      },
    },
  };

  return (
    <div
      className={`relative rounded-full h-fit w-fit ${isActive ? 'border-primary-500 border-4 ' : null}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      onClick={() => handleClick(question_id)}
    >
      {/* <div className="absolute right-[42%] bottom-[21%]  ">{'1'}</div> */}
      <Doughnut data={chartData} options={optionsWithCenterText} width={40} height={40} />
    </div>
  );
};
export default React.memo(DonutChart);
