import ImageAssets from '../../../../../../../assets/imageAsset';
import BarChart from '../../../../../../Charts/BarChart/BarChart';
const QuestionChartSection = ({ getBarchart, options }) => {
  return (
    <section className="flex flex-col  bg-white rounded-lg drop-shadow-lg p-4 gap-4 mb-4">
      <div className="flex justify-between w-full px-4">
        <div className="flex gap-4 items-center">
          <img className=" w-7 h-7" src={ImageAssets?.NoteBook_Icon} alt="" /> Answer Details{' '}
        </div>
        <div className="flex gap-4">
          <div className=" flex gap-3 items-center">
            <img src={ImageAssets?.Group_Icon} alt="" className="w-5 h-5" /> My Class
          </div>
          <div className=" flex gap-3 items-center">
            <img src={ImageAssets?.Group_Icon} alt="" className="w-5 h-5" />
            Group
          </div>
        </div>
      </div>
      <div>
        {/* {console.log(selectedQuestion, questionDetails, getBarchart(), 'barchart')} */}
        <BarChart chartData={getBarchart()} chartOptions={options} />
      </div>
    </section>
  );
};

export default QuestionChartSection;
