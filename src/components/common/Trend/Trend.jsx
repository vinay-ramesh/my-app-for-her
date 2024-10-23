import React, { useEffect, useState } from 'react';
import ImageAssets from '../../../assets/imageAsset';
import { Line } from 'react-chartjs-2';

import styles from './Trend.module.css';
import moment from 'moment';
import { RANK_STUDENT_STUDY_CIRCLE } from '../../../utils/Constants/constants';

export const ReadVelocityHeadder = ({ title, subTitle, value }) => {
  return (
    <div className=" flex">
      <div>
        {title} <br />
        {subTitle}
      </div>

      <div>{value}</div>
    </div>
  );
};

export const TrendButton = ({ title, isActive, name, variable, handleClick, index }) => {
  return (
    <div>
      <button
        className={`bg-gray-100 text-sm font-medium text-gray-400 w-full px-4 py-2 mt-3 text-left rounded-lg border border-gray-200 ${isActive === index ? 'bg-orange-500  text-white border-orange-600' : ''}`}
        onClick={() => handleClick(name, variable, index)}
      >
        {title}
        <span className={` text-white ml-3 font-bold ${isActive === index ? null : 'invisible'}`}>{'>'}</span>
      </button>
    </div>
  );
};
const readVelocityConstantMultiply = process.env.VITE_CONSTANT_READ_VELOCITY_MAX;

const Trend = ({ data, buttonData, options, width, height, activeButton, handleActiveButton, selectedButton }) => {
  const [selectedChartValues, setSelectedChartValues] = useState([]);
  const [selectedChartIndex, setSelectedChartIndex] = useState([]);

  console.log(activeButton, 'activeButton');
  const dataSet = {
    labels: selectedChartIndex,
    datasets: [
      {
        tension: 0.1,
        label: false,
        data: selectedChartValues,
        fill: false,
        borderColor: '#3F83F8',
        borderWidth: 2,
      },
    ],
  };

  useEffect(() => {
    handleClick('percentile_gsc', buttonData?.[0]?.variable, 0, buttonData?.[0]?.isMultiply);
  }, [data]);

  const handleClick = (names, variable, ind, multiply) => {
    console.log(names, 'name');
    handleActiveButton(ind);
    if (multiply) {
      setSelectedChartValues(
        variable?.map((num) =>
          ((Number(num?.[names] || 0) * readVelocityConstantMultiply) / num?.count_present_responses || 0)?.toFixed(2),
        ) || [],
      );
    } else {
      setSelectedChartValues(
        variable?.map((num) => Number(num?.[names] || 0)?.toFixed(names === RANK_STUDENT_STUDY_CIRCLE ? 0 : 2)) || [],
      );
    }
    setSelectedChartIndex(
      variable?.map(
        (num) =>
          moment(num?.assessment_date?.value || num?.assessment_month?.value).format('DD MMM') ||
          moment(num?.assessment_date || num?.assessment_month).format('DD MMM'),
      ) || [],
    );
  };
  console.log(selectedChartValues, selectedChartIndex, 'selectedChartIndex');

  const optionsWithTooltip = {
    ...options,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#E5E7EB',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#9CA3AF',
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${selectedButton}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className=" gap-4 grid sm:flex sm:flex-col mt-4 ">
      <div className="p-6 sm:p-4 bg-white border rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <img src={ImageAssets.Trend_Icon} alt="" />
          <div className=" text-gray-900 font-medium text-3xl">Trend</div>
        </div>
        <div className="grid sm:block md:block gap-4 " style={{ gridTemplateColumns: '1fr 3fr' }}>
          <div className="2xl:w-max lg:w-max sm:mb-4 md:mb-4 sm:w-full sm:flex sm:flex-wrap sm:gap-x-2 md:w-full md:flex md:flex-wrap md:gap-x-2 ">
            {buttonData?.map((i, index) => (
              <TrendButton
                key={index}
                title={i.title}
                isActive={activeButton}
                name={i.name}
                variable={i.variable}
                index={index}
                handleClick={() => handleClick(buttonData?.[index]?.name, i?.variable, index, buttonData?.[index]?.isMultiply)}
              />
            ))}
          </div>
          <div className={styles.trendWraper}>
            <div
              className="bg-gray-200 rounded-lg px-2 py-3 text-gray-900 text-xs w-fit h-fit my-auto mr-4 sm:mr-0 sm:px-1 sm:py-1.5 "
              style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
            >
              {buttonData?.[activeButton]?.title}
            </div>
            <div className={styles.chartwraper}>
              <Line data={dataSet} options={optionsWithTooltip} width={width || 100} height={height || 100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trend;
