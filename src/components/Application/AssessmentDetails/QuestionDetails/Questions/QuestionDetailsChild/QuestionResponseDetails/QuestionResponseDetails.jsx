import ImageAssets from '../../../../../../../assets/imageAsset';

const QuestionResponseDetails = ({ questionReportData }) => {
  return (
    <section className=" bg-white rounded-lg drop-shadow-lg p-4 gap-4">
      {questionReportData?.map((i, ind) => (
        <div key={ind}>
          <div className="flex">
            <div
              className={`  text-sm font-medium tracking-wider ${i?.response_result === 'correct' ? 'text-green-800 bg-green-100' : i?.response_result === 'incorrect' ? 'text-primary-800 bg-primary-100' : i?.response_result === 'not_answered' ? 'text-gray-800 bg-gray-100' : 'text-red-800 bg-red-100'} px-3 py-1 rounded-full capitalize my-4 `}
            >
              {' '}
              {i.response_result?.replaceAll('_', ' ')} - {i?.student_response_details?.length}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 drop-shadow-md ">
            {i?.student_response_details?.map((j, index) => (
              <div className="p-2 border flex  basis-[23.3%] gap-3 rounded-lg bg-gray-50 items-center" key={index}>
                <img src={ImageAssets?.avatar} alt="" className="w-10 h-10 rounded-full border" />
                <div className=" flex-grow">
                  <p className="text-gray-900 text-sm font-medium mb-1">{j?.student_name}</p>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <p>R#{j?.student_id}</p>
                    <p>{j?.response_time_taken || 0}s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default QuestionResponseDetails;
