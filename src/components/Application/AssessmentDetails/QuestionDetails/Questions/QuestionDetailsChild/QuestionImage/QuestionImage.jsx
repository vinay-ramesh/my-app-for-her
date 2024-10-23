import ImageAssets from '../../../../../../../assets/imageAsset';
const QuestionImage = ({ questionDetails }) => {
  return (
    <section className="flex bg-white rounded-lg drop-shadow-lg p-4 gap-4 mb-4">
      {questionDetails?.question_image_path ? (
        <img src={questionDetails?.question_image_path} alt="" />
      ) : (
        <div className="flex items-center mx-auto gap-5 capitalize text-gray-400">
          <img src={ImageAssets?.No_Resultfound} className="h-12 scale-150 object-fill" alt="" />
          No results found
        </div>
      )}
    </section>
  );
};

export default QuestionImage;
