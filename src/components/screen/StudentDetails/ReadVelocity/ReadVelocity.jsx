import ImageAssets from '../../../../assets/imageAsset';
import Badge from '../../../common/Badge/Badge';
import Speedometer from '../../../Charts/Speedometer/Speedometer';
import BarChart from '../../../Charts/BarChart/BarChart';
import { DisplayValues } from '../StudentDetails';
import styles from './ReadVelocity.module.css';
import { getDifficultyLevelChartValues } from '../CommonFunction/CommonFunction';
import ProgressChart from '../../../Charts/ProgressChart/ProgressChart';

export const ReadVelocityHeadder = ({ title, subTitle, value }) => {
  return (
    <div className=" flex gap-4">
      <div className=" text-sm text-gray-600 font-semibold">
        {title} <br />
        {subTitle}
      </div>

      <div className=" text-3xl font-medium text-gray-900">{value}</div>
    </div>
  );
};
const readVelocityConstantMultiply = process.env.VITE_CONSTANT_READ_VELOCITY_MAX;

const ReadVelocity = ({ data }) => {
  return (
    <div className="   bg-white  mt-4 border rounded-lg shadow-lg">
      <div className=" flex items-center justify-between w-full border-b py-4 px-4 flex-wrap gap-6">
        <div className="flex items-center flex-grow sm:justify-center gap-3 ">
          <img src={ImageAssets.Speedometer_Icon} alt="" />
          <div className=" sm:text-2xl text-3xl font-semibold text-gray-600">Read Velocity</div>
          <div className=" text-lg font-medium text-gray-600">
            {((data?.average_velocity || 0) * readVelocityConstantMultiply).toFixed(2)}
          </div>
          <img
            src={data?.average_velocity >= data?.avg_velocity_in_gsc ? ImageAssets.Green_Arrow : ImageAssets?.Red_Arrow}
            alt=""
            className=" "
          />
        </div>
        <div className="flex gap-4 flex-grow justify-center">
          <div className=" text-sm px-2 py-1 rounded-lg bg-gray-100 w-fit border border-gray-200">
            <div className=" text-sm font-medium ">
              {((data?.avg_velocity_in_gsc || 0) * readVelocityConstantMultiply)?.toFixed(2) || 0}
            </div>
            <div className=" text-gray-400 text-xs font-medium">Group Avg.</div>
          </div>
          <div className=" text-sm px-2 py-1 rounded-lg bg-gray-100 w-fit border border-gray-200">
            <div className=" text-sm font-medium ">
              {((data?.avg_velocity_in_sc || 0) * readVelocityConstantMultiply)?.toFixed(2) || 0}
            </div>
            <div className=" text-gray-400 text-xs font-medium">Study Circle Avg.</div>
          </div>
        </div>
        <div className="flex gap-6 flex-grow justify-center sm:justify-between sm:px-2">
          <ReadVelocityHeadder title={'Rank'} subTitle={'(Study Circle)'} value={data?.student_rank_in_sc || 0} />
          <ReadVelocityHeadder title={'Group'} subTitle={'Percentile'} value={data?.student_percentile_in_gsc?.toFixed(2) || 0} />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 border-collapse">
        <div className="border-b border-r sm:border-r-0 px-8 py-4 sm:px-2 ">
          <div className="w-fit mx-auto">
            <Badge name={'Total Questions'} />
          </div>
          <div className={styles.barChartWraper}>
            <BarChart values={getDifficultyLevelChartValues(data?.difficulty_wise_results)} />
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
            mainValue={((data?.avg_accuracy_score || 0) * readVelocityConstantMultiply)?.toFixed(2)}
            mainTrend={data?.avg_accuracy_score >= data?.avg_accuracy_in_gsc ? 'up' : 'down'}
            avgTitle={'Group Avg.'}
            avgValue={((data?.avg_accuracy_in_gsc || 0) * readVelocityConstantMultiply)?.toFixed(2)}
          />
          <div className={styles.speedometerWraper}>
            <Speedometer value={data?.avg_accuracy_score} />
          </div>
        </div>
        <div
          className="grid sm:!grid-cols-1 md:!grid-cols-1 lg:!grid-cols-1 gap-4 py-10 sm:p-6 md:p-6 sm:border-r-0 items-center  px-10  border-r"
          style={{ gridTemplateColumns: '1fr 3fr' }}
        >
          <DisplayValues
            title={'Score'}
            mainValue={`${((data?.average_score || 0) * readVelocityConstantMultiply)?.toFixed(2)}`}
            mainTrend={data?.average_score > data?.avg_response_score_in_gsc ? 'up' : 'down'}
            avgTitle={'Group Avg.'}
            avgValue={((data?.avg_response_score_in_gsc || 0) * readVelocityConstantMultiply)?.toFixed(2)}
          />
          <ProgressChart values={data} />
        </div>
        {/*  progress*/}
        <div className="grid gap-4 py-10 items-center  px-10  sm:border-r-0 grid-cols-[1fr_3fr] sm:grid-cols-1 md:grid-cols-1 ">
          <DisplayValues
            title={'Speed'}
            mainValue={(data?.avg_response_speed_score?.toFixed(2) || 0) + ' sec'}
            mainTrend={data?.avg_response_speed_score < data?.avg_time_taken_in_gsc ? 'up' : 'down'}
            avgTitle={'Group Avg.'}
            avgValue={(data?.avg_time_taken_in_gsc?.toFixed(2) || 0) + ' sec'}
          />
          <div>
            <div className=" relative h-2.5  w-full  sm:py-9 md:py-9   ">
              <div
                className={` absolute left-0 z-[0] h-2.5 rounded-full ${data?.avg_response_speed_score > data?.avg_time_taken_in_gsc ? 'bg-red-500' : 'bg-green-500'}   `}
                style={{
                  width: `${(Math.max(data?.avg_response_speed_score, data?.avg_time_taken_in_gsc) / Math.max(data?.avg_response_speed_score, data?.avg_time_taken_in_gsc)) * 100}%`,
                }}
              >
                {' '}
                <div className="absolute bottom-5 right-0  font-medium text-gray-700 text-sm">
                  <div className="flex">
                    <img
                      src={
                        data?.avg_response_speed_score > data?.avg_time_taken_in_gsc
                          ? ImageAssets?.Single_Student_Red_Icon
                          : ImageAssets?.Group_Student_icon
                      }
                      alt=""
                      className="w-8 h-5"
                    />
                    {Math.max(data?.avg_response_speed_score || 0, data?.avg_time_taken_in_gsc || 0)?.toFixed(2) || 0}sec
                  </div>
                  <div className="relative left-2">
                    <img
                      src={
                        data?.avg_response_speed_score > data?.avg_time_taken_in_gsc
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
                  width: `${(Math.min(data?.avg_response_speed_score, data?.avg_time_taken_in_gsc) / Math.max(data?.avg_response_speed_score, data?.avg_time_taken_in_gsc)) * 100}%`,
                }}
              >
                <div className="rounded-full absolute top-5 right-0  font-medium text-gray-700 text-sm">
                  <div className="relative -right-2">
                    <img src={ImageAssets?.Up_Triangle_Icon} alt="sv" className="w-5 h-4 ml-auto " />
                  </div>
                  <div className="flex sm:relative left-[73%]">
                    <img
                      src={
                        data?.avg_response_speed_score > data?.avg_time_taken_in_gsc
                          ? ImageAssets?.Group_Student_icon
                          : ImageAssets?.Single_Student_Green_Icon
                      }
                      alt=""
                      className="w-8 h-5"
                    />
                    {Math.min(data?.avg_response_speed_score || 0, data?.avg_time_taken_in_gsc || 0).toFixed(2) || 0}sec
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
