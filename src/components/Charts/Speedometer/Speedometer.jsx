import React from 'react';
import styles from './Speedometer.module.css';
import GaugeComponent from 'react-gauge-component';

const Speedometer = ({ value }) => {
  // Function to generate gradient colors between two colors
  const generateGradientColors = (startColor, endColor, steps) => {
    const start = parseInt(startColor.slice(1), 16);
    const end = parseInt(endColor.slice(1), 16);

    const rStart = (start >> 16) & 0xff;
    const gStart = (start >> 8) & 0xff;
    const bStart = start & 0xff;

    const rEnd = (end >> 16) & 0xff;
    const gEnd = (end >> 8) & 0xff;
    const bEnd = end & 0xff;

    const rStep = (rEnd - rStart) / steps;
    const gStep = (gEnd - gStart) / steps;
    const bStep = (bEnd - bStart) / steps;

    const colors = [];

    for (let i = 0; i <= steps; i++) {
      const r = Math.round(rStart + rStep * i);
      const g = Math.round(gStart + gStep * i);
      const b = Math.round(bStart + bStep * i);

      colors.push(`#${(1 << 24) + (r << 16) + (g << 8) + b}`.slice(1));
    }

    return colors;
  };

  const gradientColors = [...generateGradientColors('#EB5757', '#F2C94C', 10), ...generateGradientColors('#FF9E00', '#FFBE00', 10)];
  return (
    <div className={styles.container}>
      <GaugeComponent
        className=" w-full h-auto"
        type="semicircle"
        arc={{
          cornerRadius: 0,
          padding: 0,
          subArcs: [
            {
              color: '#EB5757',
            },
            {
              color: '#F2C94C',
            },
            {
              color: '#31C48D',
            },
          ],
        }}
        pointer={{
          type: 'needle',
          color: '#000',
          length: 0.8,
          width: 10,
          elastic: true,
        }}
        labels={{
          valueLabel: { formatTextValue: () => 1, style: { fontSize: '0px' } },
          tickLabels: {
            hideMinMax: true,
            type: 'outer',
            valueConfig: { formatTextValue: (value) => value, fontSize: 20 },
            ticks: [
              { value: 0, valueConfig: { formatTextValue: (value) => 0, style: { fontSize: '14px' } } },
              { value: 20, valueConfig: { formatTextValue: (value) => 1, style: { fontSize: '14px' } } },
              { value: 40, valueConfig: { formatTextValue: (value) => 2, style: { fontSize: '14px' } } },
              { value: 60, valueConfig: { formatTextValue: (value) => 3, style: { fontSize: '14px' } } },
              { value: 80, valueConfig: { formatTextValue: (value) => 4, style: { fontSize: '14px' } } },
              { value: 100, valueConfig: { formatTextValue: (value) => 5, style: { fontSize: '14px' } } },
            ],
          },
        }}
        value={(value || 0 / 5) * 100}
        minValue={0}
        maxValue={100}
      />
    </div>
  );
};

export default Speedometer;
