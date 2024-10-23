import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';

const PerformanceGraph = ({
  value,
  labelName,
  lableValues,
  fill,
  lineColor,
  lineThickness,
  fillcolor,
  removeAnimation,
  radius,
  xAxis,
  yAxis,
  legend,
  width,
  height,
  tooltip,
  selectedButton,
}) => {
  const chartRef = useRef(null);
  console.log(yAxis, value, 'yAxis');
  const data = {
    labels: lableValues,
    datasets: [
      {
        tension: 0.1,
        label: labelName,
        data: value,
        fill: fill,
        borderColor: lineColor || '#1E429F',
        borderWidth: lineThickness || 1,
        backgroundColor: (context) => {
          const chart = context?.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            // This can happen initially before the chart is fully initialized.
            return null;
          }

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          fillcolor?.map((i) => {
            gradient?.addColorStop(i.percemtage, i.rgba);
          });

          //   gradient.addColorStop(1, 'rgba(207, 221, 255, 1)');

          return gradient || '';
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: removeAnimation || 200,
    },
    radius: radius || 0,
    scales: {
      x: {
        reverse: xAxis?.reverse,
        ticks: {
          display: xAxis?.ticks,
        },

        grid: {
          drawBorder: true,
          display: xAxis?.gridlines,
          offset: false,
          borderDash: [8, 4],
          color: xAxis.gridColor,
        },
        border: {
          display: xAxis?.border,
          dash: xAxis.gridLineDash || [0, 0],
        },
      },
      y: {
        reverse: yAxis.reverse,
        min: yAxis?.minValue || yAxis?.minValue === 0 ? yAxis?.minValue : 'auto',
        max: yAxis?.maxValue || yAxis?.maxValue === 0 ? yAxis?.maxValue : 'auto',

        ticks: {
          display: yAxis?.ticks,
          stepSize: yAxis?.step,
        },
        grid: {
          drawBorder: false,
          display: yAxis?.gridlines,
          tickBorderDash: [8, 4],
          tickColor: '#000',
          drawTicks: true,
          color: yAxis.gridColor,
          offset: false,
        },
        border: {
          display: yAxis?.border,
          dash: xAxis.gridLineDash || [0, 0],
        },
      },
    },
    plugins: {
      legend: {
        display: legend || false,
      },
      tooltip: {
        backgroundColor: '#E5E7EB',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#9CA3AF',
        enabled: tooltip || false,
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${selectedButton}: ${value}`;
          },
        },
      },
    },
  };

  return <Line ref={chartRef} data={data} options={options} width={width || 100} height={height || 100} />;
};

export default PerformanceGraph;
