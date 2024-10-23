import React, { useRef } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ImageAsset from '../../../../assets/imageAsset';
import PerformanceGraph from '../../../Charts/LineChart';

export const PerformanceSubComponent = ({ i, readVelocity_Score }) => {
  console.log(i, readVelocity_Score, 'graphRead');
  return (
    <div className=" text-center border-r grid grid-cols-2 items-center w-full px-4 sm:border-0 md:border-0 ">
      <div>
        <p
          className={`${i.avg_response_velocity > 0 && i.avg_response_velocity < 0.4 ? 'text-red-600' : i.avg_response_velocity >= 0.4 && i.avg_response_velocity < 0.6 ? 'text-yellow-400' : i.avg_response_velocity >= 0.6 && i.avg_response_velocity < 0.8 ? 'text-primary-800' : 'text-green-500'} text-2xl font-bold`}
        >
          {(i.avg_response_velocity * readVelocity_Score).toFixed(2)}
        </p>
        <h3 className={`text-gray-400 text-sm font-medium `}>{i?.question_subject_name || 'All Subjects'}</h3>
      </div>
      <div className="">
        <PerformanceGraph
          lineColor={`${i.avg_response_velocity > 0 && i.avg_response_velocity < 0.4 ? '#e02424' : i.avg_response_velocity >= 0.4 && i.avg_response_velocity < 0.6 ? '#e3a008' : i.avg_response_velocity >= 0.6 && i.avg_response_velocity < 0.8 ? '#1e429f' : '#0e9f6e'}`}
          width={100}
          height={65}
          lagend={false}
          value={i.measures_history?.map((i) => i.sum_response_velocity / i.count_present_responses)}
          lableValues={[1, 2, 3, 4]}
          fill={true}
          fillcolor={[
            {
              rgba: 'rgba(131, 180, 249, 0)',
              percemtage: 1,
            },
            {
              rgba: 'rgba(207, 221, 255, 1)',
              percemtage: 0,
            },
          ]}
          removeAnimation={true}
          radius={false}
          xAxis={{
            ticks: false,
            gridlines: false,
            border: false,
            gridColor: '#000',
            gridLineDash: [10, 10],
            reverse: false,
          }}
          yAxis={{
            ticks: false,
            gridlines: false,
            border: false,
            gridColor: '#000',
            gridLineDash: [10, 10],
            reverse: false,
          }}
        />
      </div>
    </div>
  );
};

const PerformanceMetrics = ({ performanceData, noDataFound }) => {
  const carouselRef = useRef(null);
  const readVelocityConstantMultiply = process.env.VITE_CONSTANT_READ_VELOCITY_MAX;

  return (
    <div className="  flex sm:flex-col md:flex-col bg-white rounded-lg border mt-4 p-4 shadow-lg gap-4 ">
      <div className="  pr-3  border-r border-gray-400 sm:border-r-0 md:border-r-0 sm:border-b md:border-b sm:pb-2 md:pb-2 ">
        <img src={ImageAsset.Speedometer_Icon} alt="Speedometer_Icon" className=" mx-auto  w-11 h-11" />
        <p className=" text-center text-sm font-semibold text-gray-600 whitespace-nowrap">Read Velocity</p>
      </div>
      {noDataFound?.readVelocityData ? (
        <div className="sm:hidden md:hidden flex items-center justify-center gap-4 flex-grow self-center text-gray-700 font-semibold">
          {' '}
          <img src={ImageAsset?.No_Resultfound} className="h-11 scale-150 object-fill" alt="" />
          No Data Found
        </div>
      ) : (
        <Carousel
          ref={carouselRef}
          additionalTransfrom={0}
          autoPlaySpeed={3000}
          centerMode={false}
          className=" sm:hidden md:hidden"
          containerClass="container"
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite={false}
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 4,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },

              partialVisibilityGutter: 30,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          arrows={false}
          renderButtonGroupOutside={true}
        >
          {performanceData?.map((i, ind) => (
            <PerformanceSubComponent key={ind} i={i} readVelocity_Score={readVelocityConstantMultiply} />
          ))}
        </Carousel>
      )}
      {noDataFound?.readVelocityData ? (
        <div className="lg:hidden xl:hidden 2xl:hidden flex items-center gap-4 flex-grow self-center text-gray-700 font-semibold">
          {' '}
          <img src={ImageAsset?.No_Resultfound} className="h-11 scale-150 object-fill" alt="" />
          No Data Found
        </div>
      ) : (
        <div className=" lg:hidden xl:hidden 2xl:hidden sm:grid md:grid grid-cols-2 gap-x-2 gap-y-7 ">
          {performanceData?.map((i, key) => (
            <PerformanceSubComponent i={i} key={key} readVelocity_Score={readVelocityConstantMultiply} />
          ))}
        </div>
      )}

      <div className=" sm:hidden md:hidden flex items-center gap-6">
        <div
          onClick={() => {
            carouselRef.current.previous();
          }}
        >
          <img src={ImageAsset.Arrow_Right} alt="" className=" w-7 rotate-180" />
        </div>
        <div
          onClick={() => {
            carouselRef.current.next();
          }}
        >
          <img src={ImageAsset.Arrow_Right} alt="" className=" w-7" />
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
