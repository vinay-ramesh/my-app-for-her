import ImageAssets from '../../../../../../../assets/imageAsset';
const QuestionDescription = ({ questionDetails }) => {
  return (
    <section className="flex bg-white justify-between rounded-lg drop-shadow-lg p-4 gap-2 mb-4">
      <div className="bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">
        {questionDetails?.question_objective_name}
      </div>
      <div className="bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">
        Difficulty: {questionDetails?.question_difficulty_level}
      </div>
      <div className="bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">
        {questionDetails?.question_type_name}
      </div>
      {/* <div className="bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">
                  {questionDetails?.question_type_name}
                </div> */}
      <div className="flex gap-2 items-center bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">
        <img src={ImageAssets?.Globe_Icon} alt="" />
        By: {questionDetails?.question_author}
      </div>
      <div className=" bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">Q# {questionDetails?.question_id}</div>
    </section>
  );
};

export default QuestionDescription;
