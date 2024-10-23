import React, { useRef } from 'react';
import DonutChart from '../../../../../../Charts/DonutChart/DonutChart';
import ImageAssets from '../../../../../../../assets/imageAsset';
import Carousel from 'react-multi-carousel';
const CarousalSection = ({ questionList, isDataAvailable, handleChange, selectedQuestion }) => {
  const carouselRef = useRef();
  const createDataSet = (e) => {
    console.log(e);
    return {
      labels: ['Red', 'Blue', 'Green', 'Gray'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [
            e?.count_incorrect_responses,
            e?.count_near_correct_responses,
            e?.count_not_answered_responses,
            e?.count_not_answered_responses,
          ],
          backgroundColor: [
            '#FF0000', // Red
            'rgba(54, 162, 235, 0.6)', // Blue
            '#E6E6E6', // gray
            '#5AAB00', // Green
          ],
          borderColor: [
            '#FF0000', // Red
            'rgba(54, 162, 235, 0.6)', // Blue
            '#E6E6E6', // gray
            '#5AAB00', // Green
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Custom Chart Options
  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      tooltip: {
        enabled: false, // Disable default tooltips
      },
    },
    cutout: '50%', // Sets the size of the donut hole
  };
  return (
    <div className="  flex items-center justify-between sm:flex-col md:flex-col bg-white rounded-lg border  p-4 shadow-lg gap-4 mb-4 ">
      <div className="  pr-3 whitespace-nowrap  border-r border-gray-400 sm:border-r-0 md:border-r-0 sm:border-b md:border-b sm:pb-2 md:pb-2 ">
        Questions {`(${questionList?.length})`}
      </div>
      {isDataAvailable?.QuestionListData ? (
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
          // renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 10,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 5,
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
          {questionList?.map((i, ind) => (
            <div key={ind}>
              <DonutChart
                chartData={createDataSet(i)}
                question_id={i?.question_id}
                chartOptions={options1}
                key={ind}
                isActive={i?.question_id === selectedQuestion}
                handleClick={(e) => handleChange(e)}
                centerText={ind + 1}
              />
            </div>
          ))}
        </Carousel>
      ) : (
        <div className="flex items-center gap-5 capitalize text-gray-400">
          <img src={ImageAssets?.No_Resultfound} className="h-12 scale-150 object-fill" alt="" />
          No results found
        </div>
      )}
      <div className=" lg:hidden xl:hidden 2xl:hidden sm:grid md:grid grid-cols-2 gap-x-2 gap-y-7 "></div>

      <div className=" sm:hidden md:hidden flex items-center gap-6">
        <div
          onClick={() => {
            carouselRef.current.previous();
          }}
        >
          <img src={ImageAssets.Arrow_Right} alt="" className=" w-7 rotate-180 cursor-pointer" />
        </div>
        <div
          onClick={() => {
            carouselRef.current.next();
          }}
        >
          <img src={ImageAssets.Arrow_Right} alt="" className=" w-7 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default CarousalSection;
