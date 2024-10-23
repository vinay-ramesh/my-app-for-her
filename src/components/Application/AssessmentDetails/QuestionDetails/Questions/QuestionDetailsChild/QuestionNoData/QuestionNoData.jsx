import ImageAssets from '../../../../../../../assets/imageAsset';

const QuestionNoData = ({ height }) => {
  return (
    <section className="flex items-center bg-white rounded-lg drop-shadow-lg p-4 gap-4 h-[70dvh] mb-4" style={{ height: height }}>
      <div className="flex flex-col items-center mx-auto gap-5 capitalize text-xl text-gray-400">
        <img src={ImageAssets?.No_Resultfound} className="h-28 scale-150 object-fill" alt="" />
        No results found
      </div>
    </section>
  );
};

export default QuestionNoData;
