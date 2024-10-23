const QuestionAnswerSection = ({ answerJson }) => {
  return (
    <section className="flex bg-white rounded-lg drop-shadow-lg p-4 gap-4 mb-4">
      <div className="bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">
        Correct Options : <span>{answerJson?.[0]?.option_text || 0}</span>
      </div>
      {answerJson?.[0]?.is_near_correct_option ? (
        <div className="bg-gray-100 px-4 py-0.5 text-sm border border-gray-200 rounded-lg ">
          {`Near Correct Options : ${answerJson?.[0]?.is_near_correct_option_text || 0}`}
        </div>
      ) : null}
    </section>
  );
};

export default QuestionAnswerSection;
