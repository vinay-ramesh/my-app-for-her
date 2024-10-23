import React from 'react';
import styles from './SchoolTable.module.css';

const SchoolTable = (props) => {
  const { institutionList, handleSelectedSchool, selectedSchool, noDataFound } = props;
  return (
    <div className="sm:min-h-fit md:min-h-fit min-h-[24rem]">
      <div className="border  rounded-lg overflow-hidden  ">
        <div className={styles.tableWraper}>
          <table className="text-left rtl:text-right text-gray-500 text-xs md:text-md lg:text-lg xl:text-lg 2xl:text-lg w-full ">
            <thead className="text-gray-500 uppercase bg-gray-50 sticky top-0 z-12">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs md:text-sm lg:text-md xl:text-sm 2xl:text-sm ">
                  School Name
                </th>
                <th scope="col" className="px-6 py-3 text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
                  School Code
                </th>
              </tr>
            </thead>
            <tbody className="sm:max-h-72 md:sm:max-h-72 max-h-96  min-h-[24rem] overflow-y-auto">
              {!noDataFound ? (
                institutionList?.map((institution) => {
                  return (
                    <tr
                      className={
                        selectedSchool.institution_id == institution.institution_id
                          ? 'cursor-pointer bg-[#1A56DB] '
                          : 'bg-white border-b cursor-pointer text-gray-900 font-normal hover:bg-primary-50'
                      }
                      key={institution.institution_id}
                      onClick={() => handleSelectedSchool(institution)}
                    >
                      <td
                        scope="row"
                        className={
                          selectedSchool.institution_id == institution.institution_id
                            ? 'px-6 py-4 text-white font-normal text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm'
                            : 'px-6 py-4 text-gray-900 font-normal text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm'
                        }
                      >
                        {institution?.institution_name || 'NA'}
                      </td>
                      <td
                        scope="row"
                        className={
                          selectedSchool.institution_id == institution.institution_id
                            ? 'px-6 py-4 text-white font-normal text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm'
                            : 'px-6 py-4 text-gray-700 font-normal text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm'
                        }
                      >
                        {institution?.institution_code || 'NA'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-white text-center align-baseline">
                  <td colSpan={2} scope="row" className="px-6 py-4 text-gray-900 min-h-[24rem] font-normal">
                    No Institutions Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolTable;
