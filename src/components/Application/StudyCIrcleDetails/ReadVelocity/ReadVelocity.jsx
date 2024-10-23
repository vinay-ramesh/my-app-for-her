import React, { useRef } from 'react';
import ImageAssets from '../../../../assets/imageAsset';
import Badge from '../../../common/Badge/Badge';
import Speedometer from '../../../Charts/Speedometer/Speedometer';
import BarChart from '../../../Charts/BarChart/BarChart';
import { DisplayValues } from '../../../screen/StudentDetails/StudentDetails';
import styles from './ReadVelocity.module.css';
import { getDifficultyLevelChartValues } from '../CommonFunction/CommonFunction';
import ProgressChart from '../../../Charts/ProgressChart/ProgressChart';
import Carousel from 'react-multi-carousel';
import { ReadVelocityHeadder } from '../../../screen/StudentDetails/ReadVelocity/ReadVelocity';

const readVelocityConstantMultiply = process.env.VITE_CONSTANT_READ_VELOCITY_MAX;

const ReadVelocity = ({ data }) => {
  const carouselRef = useRef(null);
  console.log(data, 'readvelocity');
  return (
    <div className="   bg-white  mt-4 border rounded-lg shadow-lg">
      <div className="flex flex-wrap items-center justify-between bg-white border px-4 py-4 rounded-lg bordre-b">
        <div>Dynamical systems and differential equations</div>
        {data?.arr_assessments_codes?.length > 0 ? (
          <div className="flex items-center gap-4 w-[60%] sm:w-full md:w-full md:mt-3 sm:mt-3">
            <div
              onClick={() => {
                carouselRef?.current?.previous();
              }}
            >
              <img src={ImageAssets.Arrow_Right} alt="" className=" w-7 rotate-180 cursor-pointer" />
            </div>

            <Carousel
              ref={carouselRef}
              additionalTransfrom={0}
              autoPlaySpeed={3000}
              centerMode={false}
              className=""
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
                  items: 8,
                  partialVisibilityGutter: 40,
                },
                mobile: {
                  breakpoint: {
                    max: 464,
                    min: 0,
                  },
                  items: 2,
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
              {data?.arr_assessments_codes?.map((i, index) => (
                <div className=" border rounded-lg w-fit px-2 py-2 text-sm text-gray-800 drop-shadow-lg " key={index}>
                  S# {i.group_session_id}
                </div>
              ))}
            </Carousel>

            <div className="  flex items-center gap-6">
              <div
                onClick={() => {
                  carouselRef.current.next();
                }}
              >
                <img src={ImageAssets.Arrow_Right} alt="" className=" w-7 cursor-pointer" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className=" flex items-center justify-between w-full border-b py-4 px-4 flex-wrap gap-6">
        <div className="flex items-center flex-grow sm:justify-center gap-3 ">
          <img src={ImageAssets.Speedometer_Icon} alt="" />
          <div className=" sm:text-2xl text-3xl font-semibold text-gray-600">Read Velocity</div>
          <div className=" text-lg font-medium text-gray-600">
            {((data?.avg_response_velocity || 0) * readVelocityConstantMultiply).toFixed(2)}
          </div>
          <img
            src={
              data?.avg_response_velocity >= data?.avg_group_response_velocity ? ImageAssets.Green_Arrow : ImageAssets?.Red_Arrow
            }
            alt=""
            className=" "
          />
          <div className=" text-sm px-2 py-1g  w-fit ">
            <div className=" text-gray-400 text-xs font-medium">Group Avg.</div>
            <div className=" text-sm font-medium ">
              {((data?.avg_group_response_velocity || 0) * readVelocityConstantMultiply)?.toFixed(2) || 0}
            </div>
          </div>
        </div>

        <div className="flex gap-6 flex-grow justify-end  sm:justify-between sm:px-2">
          <ReadVelocityHeadder title={'Group'} subTitle={'Percentile'} value={data?.group_percentile?.toFixed(2) || 0} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 border-collapse">
        <div className="border-b border-r sm:border-r-0 px-8 py-4 sm:px-2 ">
          <div className="w-fit mx-auto">
            <Badge name={'Total Questions'} />
          </div>
          <div className={styles.barChartWraper}>
            <BarChart values={getDifficultyLevelChartValues(data?.arr_difficulty_wise_results)} />
          </div>
          <div className="w-fit mx-auto text-xs font-medium">
            <Badge name={'Difficulty level'} />
          </div>
        </div>
        <div
          className="grid  gap-4 py-4 px-10 border-b items-center content-center h-full sm:flex sm:flex-col sm:px-2 md:flex md:flex-col md:px-2 "
          style={{ gridTemplateColumns: '1fr 2fr' }}
        >
          <DisplayValues
            title={'Accuracy'}
            mainValue={((data?.avg_response_accuracy_score || 0) * readVelocityConstantMultiply)?.toFixed(2)}
            mainTrend={data?.avg_response_accuracy_score >= data?.avg_group_response_accuracy_score ? 'up' : 'down'}
            avgTitle={'Group Avg.'}
            avgValue={((data?.avg_group_response_accuracy_score || 0) * readVelocityConstantMultiply)?.toFixed(2)}
          />
          <div className={styles.speedometerWraper}>
            <Speedometer value={data?.avg_response_accuracy_score} />
          </div>
        </div>
        <div
          className="grid sm:!grid-cols-1 md:!grid-cols-1 lg:!grid-cols-1 gap-4 py-10 sm:p-6 md:p-6 sm:border-r-0 items-center  px-10  border-r"
          style={{ gridTemplateColumns: '1fr 3fr' }}
        >
          <DisplayValues
            title={'Score'}
            mainValue={`${((data?.avg_response_main_score || 0) * readVelocityConstantMultiply)?.toFixed(2)}`}
            mainTrend={data?.avg_response_main_score > data?.avg_group_response_main_score ? 'up' : 'down'}
            avgTitle={'Group Avg.'}
            avgValue={((data?.avg_group_response_main_score || 0) * readVelocityConstantMultiply)?.toFixed(2) + 'sec'}
          />
          <ProgressChart values={data} />
        </div>
        {/*  progress*/}
        <div className="grid gap-4 py-10 items-center grid-cols-[1fr_3fr] sm:grid-cols-1 md:grid-cols-1  px-10  sm:border-r-0 ">
          <DisplayValues
            title={'Speed'}
            mainValue={(data?.avg_response_speed_score?.toFixed(2) || 0) + 'sec'}
            mainTrend={data?.avg_response_speed_score < data?.avg_group_response_speed_score ? 'up' : 'down'}
            avgTitle={'Group Avg.'}
            avgValue={(data?.avg_group_response_speed_score?.toFixed(2) || 0) + 'sec'}
          />
          <div>
            <div className=" relative h-2.5  w-full  sm:py-9 md:py-9   ">
              <div
                className={` absolute left-0 z-[0] h-2.5 rounded-full ${data?.avg_response_speed_score > data?.avg_group_response_speed_score ? 'bg-red-500' : 'bg-green-500'}   `}
                style={{
                  width: `${(Math.max(data?.avg_response_speed_score, data?.avg_group_response_speed_score) / Math.max(data?.avg_response_speed_score, data?.avg_group_response_speed_score)) * 100}%`,
                }}
              >
                {' '}
                <div className="absolute bottom-5 right-0  font-medium text-gray-700 text-sm">
                  <div className="flex">
                    <img
                      src={
                        data?.avg_response_speed_score > data?.avg_group_response_speed_score
                          ? ImageAssets?.Single_Student_Red_Icon
                          : ImageAssets?.Study_Circle_Icon
                      }
                      alt=""
                      className="w-8 h-5"
                    />
                    {Math.max(data?.avg_response_speed_score || 0, data?.avg_group_response_speed_score || 0)?.toFixed(2) || 0}sec
                  </div>
                  <div className="relative left-2">
                    <img
                      src={
                        data?.avg_response_speed_score > data?.avg_group_response_speed_score
                          ? ImageAssets?.Down_Triangle_Red_Icon
                          : ImageAssets?.Down_Triangle_Green_Icon
                      }
                      alt="sv"
                      className="w-5 h-4 ml-auto "
                    />
                  </div>
                </div>
              </div>
              <div
                className={` rounded-full absolute h-2.5 z-0 bg-gray-300`}
                style={{
                  width: `${(Math.min(data?.avg_response_speed_score, data?.avg_group_response_speed_score) / Math.max(data?.avg_response_speed_score, data?.avg_group_response_speed_score)) * 100}%`,
                }}
              >
                <div className="rounded-full absolute top-5 right-0  font-medium text-gray-700 text-sm">
                  <div className="relative -right-2">
                    <img src={ImageAssets?.Up_Triangle_Icon} alt="sv" className="w-5 h-4 ml-auto " />
                  </div>
                  <div className="flex sm:relative left-[73%]">
                    <img
                      src={
                        data?.avg_group_response_speed_score > data?.avg_response_speed_score
                          ? ImageAssets?.Single_Student_Green_Icon
                          : ImageAssets?.Study_Circle_Icon
                      }
                      alt=""
                      className="w-8 h-5"
                    />
                    {Math.min(data?.avg_response_speed_score || 0, data?.avg_group_response_speed_score || 0).toFixed(2) || 0}sec
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadVelocity;
