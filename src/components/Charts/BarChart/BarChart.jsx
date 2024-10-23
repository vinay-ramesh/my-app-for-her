import React, { useRef, memo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useType } from '../../../utils/deviceType';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ values, chartData, chartOptions }) => {
  const chartRef = useRef(null);
  const deviceType = useType();
  const correct = values?.correct || [];
  const nearCorrect = values?.nearCorrect || [];
  const incorrect = values?.incorrect || [];
  const notAnswered = values?.notAnswered || [];
  const totalValue = values?.totalValue || [];

  const data = {
    labels: values?.difficulty || [],
    datasets: [
      {
        label: 'Correct',
        data: correct,
        backgroundColor: '#31C48D',
        barPercentage: 0.3,
      },
      {
        label: 'Near Correct',
        data: nearCorrect,
        backgroundColor: '#3F83F8',
        barPercentage: 0.3,
      },
      {
        label: 'Incorrect',
        data: incorrect,
        backgroundColor: '#F05252',
        barPercentage: 0.3,
      },
      {
        label: 'Not Answered',
        data: notAnswered,
        backgroundColor: '#9CA3AF',
        barPercentage: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      onComplete: (context) => {
        const chart = context?.chart;
        const { ctx, chartArea } = chart;
        ctx.save();

        totalValue.forEach((label, index) => {
          const meta = chart.getDatasetMeta(0); // Meta of the first dataset
          const total = label;

          const barPosition = meta.data[index].getCenterPoint();
          const yBase = meta.data[index].base;

          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#000';
          ctx.textBaseline = 'top';
          ctx.fillText(total, barPosition.x, yBase - chartArea?.height + 5);
        });

        ctx.restore();
      },
    },
    plugins: {
      legend: {
        display: true,
        position: deviceType === 'mobile' ? 'top' : 'left',
        title: {
          display: true,
        },
        labels: {
          boxWidth: 15,
          boxHeight: 15,
        },
      },
      tooltip: {
        enabled: false,
      },
    },

    scales: {
      y: {
        barThickness: deviceType === 'mobile' ? 12 : 6,
        stacked: true,
        beginAtZero: true,
        max: 110,
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#000000',
          stepSize: 20,
          callback: (value) => (value > 100 ? '' : `${value}%`),
        },
        grid: {
          borderDash: [5, 6],
          color: '#e8dcdc',
        },
      },
      x: {
        barThickness: deviceType === 'mobile' ? 12 : 6,
        stacked: true,
        ticks: {
          font: {
            size: 13,
            weight: '600',
          },
          color: '#000000',
          maxTicksLimit: 20,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className=" w-full  ">
      <Bar ref={chartRef} data={chartData || data} options={chartOptions || options} />
    </div>
  );
};

export default memo(BarChart);
