import React from 'react';
import ImageAssets from '../../../assets/imageAsset';
import Pagination from '../Pagination/Pagination';
import moment from 'moment/moment';
import DoughnutChart from '../../Charts/DoughnutChart/DoughnutChart';
import { MULTIPLICATION_FACTOR } from '../../../utils/Constants/constants';

const Table = (props) => {
  const {
    paginate,
    count,
    limit,
    currentPage,
    columns,
    studentData,
    handleStudentRowClick,
    getMeColor,
    keyName,
    mode,
    chartData,
    chartOptions,
  } = props;

  return (
    <div className="w-full flex flex-col h-full overflow-y-auto bg-white">
      <div className="overflow-y-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 h-5/6 sm:h-full overflow-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 rounded-2xl shadow-md">
            <tr>
              {columns?.map((ele, index) => {
                return (
                  <th scope="col" className={ele.className} key={ele.column_key + index}>
                    {ele.columnType === 'text' ? (
                      <>{ele.columnName}</>
                    ) : (
                      <div key={ele.column_key}>
                        <img src={ele.imagePath} alt={ele.columnName} className={ele.imgClassName} />
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {studentData?.length > 0
              ? studentData?.map((ele, ind) => {
                  return (
                    <tr
                      className="border-b bg-white cursor-pointer"
                      key={ele[keyName] + ind}
                      onClick={handleStudentRowClick ? () => handleStudentRowClick(ele) : null}
                    >
                      {columns.map((colEle) => {
                        return (
                          <td className={colEle.resStyle} key={colEle.column_key + ind}>
                            {colEle.resType == 'text' ? (
                              <>
                                {ele[colEle.column_key] || ele[colEle.column_key] == 0 // EQUATING TO 0 BCZ OF HANDRISE COUNT
                                  ? colEle.column_key == 'group_percentile' || colEle.column_key == 'participation_percent'
                                    ? ele[colEle.column_key]?.toFixed(2)
                                    : ele[colEle.column_key]
                                  : '--'}
                              </>
                            ) : colEle.resType == 'img' ? (
                              <>
                                {ele[colEle.column_key] === 'IMPROVING' ? (
                                  <img src={ImageAssets.arrowUp} alt="improving" />
                                ) : ele[colEle.column_key] === 'DECLINING' ? (
                                  <img src={ImageAssets.arrowDown} alt="declining" />
                                ) : ele[colEle.column_key] === 'STABLE' ? (
                                  <img src={ImageAssets.arrowStraight} alt="stable" />
                                ) : (
                                  <img src={ImageAssets.indeterminate} alt="indeterminate" />
                                )}
                              </>
                            ) : colEle.resType == 'scoreFlag' ? (
                              <span className={`rounded-lg p-1.5 ${getMeColor(ele[colEle.column_key])}`}>
                                {(+ele[colEle.column_key] * MULTIPLICATION_FACTOR)?.toFixed(2) ?? '--'}
                              </span>
                            ) : colEle.resType == 'questions' ? (
                              <>
                                {ele?.count_present_questions || ele?.count_present_questions == 0
                                  ? `${ele?.count_present_questions} / ${ele?.count_total_questions}`
                                  : `${ele?.count_total_questions}`}
                              </>
                            ) : colEle.resType == 'attendance' ? (
                              <>{`${ele?.count_present_students} / ${ele?.count_total_students_sc}`}</>
                            ) : colEle.resType == 'date' ? (
                              <>{`${moment(ele[colEle.column_key[mode]]?.value).format('DD MMM YYYY')}` || 'NA'}</>
                            ) : colEle.resType == 'graph' ? (
                              <>
                                <DoughnutChart chartData={chartData(ele)} chartOptions={chartOptions} width={'auto'} height={35} />
                              </>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
      {count ? (
        <nav
          className="flex flex-col md:flex-col gap-2 lg:flex-row xl:flex-row 2xl:flex-row justify-between items-start w-full
        md:items-center lg:items-center xl:items-center 2xl:items-center md:space-y-0 p-2 bg-white rounded-b-lg"
          aria-label="Table navigation"
        >
          <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900">
              {' '}
              {count && `${currentPage * limit - 9} - ${count < currentPage * limit ? count : currentPage * limit}`}{' '}
            </span>
            of
            <span className="font-semibold text-gray-900"> {count} </span>
          </div>
          <Pagination paginate={paginate} count={count} limit={limit} currentPage={currentPage} />
        </nav>
      ) : null}
    </div>
  );
};

export default Table;
