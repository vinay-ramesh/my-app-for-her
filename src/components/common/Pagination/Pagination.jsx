import React from 'react';
import ImageAssets from '../../../assets/imageAsset';

const Pagination = (props) => {
  const { paginate, count, limit, currentPage } = props;
  const pageNumbers = [];
  let numberOfPages = Math.ceil(count / limit);

  for (let index = 1; index <= numberOfPages; index++) {
    pageNumbers.push(index);
  }

  return (
    <div className="flex items-center justify-between sm:w-fit sm:text-xs">
      {currentPage >= 1 && currentPage !== 1 ? (
        <img
          src={ImageAssets.paginateLeft}
          alt="previous page"
          onClick={() => paginate(currentPage - 1)}
          className="rounded-l-lg border border-gray-400 px-3 py-3 cursor-pointer"
        />
      ) : (
        <img
          src={ImageAssets.paginateLeft}
          alt="no previous page"
          className="rounded-l-lg border border-gray-400 px-3 py-3 cursor-not-allowed"
        />
      )}
      {numberOfPages <= 5 ? (
        pageNumbers.map((num) => {
          return (
            <div key={num} className="flex border-t border-b border-gray-400 text-sm">
              <button
                onClick={() => paginate(num)}
                className={
                  currentPage === num
                    ? 'text-[#1A56DB] bg-[#E1EFFE] py-2 px-4 border-r border-gray-400'
                    : 'py-2 px-3 border-r border-gray-400'
                }
              >
                {num}
              </button>
            </div>
          );
        })
      ) : currentPage < 5 ? (
        <div className="flex border-t border-b border-gray-400 text-sm sm:text-xs">
          {pageNumbers.map((num, index) => {
            if (index < 4) {
              return (
                <button
                  key={num}
                  onClick={() => paginate(num)}
                  className={
                    currentPage === num
                      ? 'text-[#1A56DB] bg-[#E1EFFE] py-2 px-4 sm:py-1.5 sm:px-2.5 border-r border-gray-400'
                      : 'py-2 px-3 border-r border-gray-400'
                  }
                >
                  {num}
                </button>
              );
            } else return null;
          })}
          <p className="py-2 px-3 border-l border-r border-gray-400">...</p>
          <button onClick={() => paginate(numberOfPages)} className="py-2 px-3 border-l border-gray-400">
            {numberOfPages}
          </button>
        </div>
      ) : currentPage > 4 &&
        currentPage !== numberOfPages - 1 &&
        currentPage !== numberOfPages - 2 &&
        currentPage !== numberOfPages - 3 &&
        currentPage !== numberOfPages ? (
        <div className="flex border-t border-b border-gray-400 text-sm">
          <button onClick={() => paginate(1)} className="py-2 px-3 border-l border-gray-400">
            1
          </button>
          <p className="border-l border-gray-400 py-2 px-3">...</p>
          <button onClick={() => paginate(currentPage - 1)} className="py-2 px-3 border-l border-gray-400">
            {currentPage - 1}
          </button>
          <button onClick={() => paginate(currentPage)} className="text-[#1A56DB] bg-[#E1EFFE] py-2 px-4 border-l border-gray-400">
            {currentPage}
          </button>
          <button onClick={() => paginate(currentPage + 1)} className="py-2 px-3 border-l border-gray-400">
            {currentPage + 1}
          </button>
          <p className="border-l border-gray-400 py-2 px-3">...</p>
          <button onClick={() => paginate(numberOfPages)} className="py-2 px-3 border-l border-gray-400">
            {numberOfPages}
          </button>
        </div>
      ) : (
        <div className="flex border-t border-b border-gray-400 text-sm">
          <button onClick={() => paginate(1)} className="py-2 px-3 border-l border-gray-400">
            1
          </button>
          <button onClick={() => paginate(2)} className="py-2 px-3 border-l border-gray-400">
            2
          </button>
          <p className="border-l border-gray-400 py-2 px-3">...</p>
          {currentPage === numberOfPages - 2 ? (
            <button
              onClick={() => paginate(currentPage)}
              className={
                currentPage === numberOfPages - 2
                  ? 'text-[#1A56DB] bg-[#E1EFFE] py-2 px-4 border-l border-gray-400'
                  : 'py-2 px-3 border-l border-gray-400'
              }
            >
              {currentPage}
            </button>
          ) : (
            <button onClick={() => paginate(numberOfPages - 3)} className="py-2 px-3 border-l border-gray-400">
              {numberOfPages - 2}
            </button>
          )}
          {currentPage === numberOfPages - 1 ? (
            <button
              onClick={() => paginate(currentPage)}
              className={
                currentPage === numberOfPages - 1
                  ? 'text-[#1A56DB] bg-[#E1EFFE] py-2 px-4 border-l border-gray-400'
                  : 'py-2 px-3 border-l border-gray-400'
              }
            >
              {currentPage}
            </button>
          ) : (
            <button onClick={() => paginate(numberOfPages - 1)} className="py-2 px-3 border-l border-gray-400">
              {numberOfPages - 1}
            </button>
          )}
          {/* {currentPage === numberOfPages - 1 ? (
            <button
              onClick={() => paginate(currentPage)}
              className={
                currentPage === numberOfPages - 1
                  ? 'text-[#1A56DB] bg-[#E1EFFE] py-2 px-4 border-l border-gray-400'
                  : 'py-2 px-3 border-l border-gray-400'
              }
            >
              {currentPage}
            </button>
          ) : (
            <button onClick={() => paginate(numberOfPages - 1)} className="py-2 px-3 border-l border-gray-400">
              {numberOfPages - 1}
            </button>
          )} */}
          {currentPage === numberOfPages ? (
            <button
              onClick={() => paginate(currentPage)}
              className={
                currentPage === numberOfPages
                  ? 'text-[#1A56DB] bg-[#E1EFFE] py-2 px-4 border-l border-gray-400'
                  : 'py-2 px-3 border-l border-gray-400'
              }
            >
              {currentPage}
            </button>
          ) : (
            <button onClick={() => paginate(numberOfPages)} className="py-2 px-3 border-l border-gray-400">
              {numberOfPages}
            </button>
          )}
        </div>
      )}
      {currentPage >= 1 && currentPage !== numberOfPages ? (
        <img
          src={ImageAssets.paginateRight}
          alt="next page"
          onClick={() => paginate(currentPage + 1)}
          className="rounded-r-lg border border-gray-400 px-3 py-3 cursor-pointer"
        />
      ) : (
        <img
          src={ImageAssets.paginateRight}
          alt="no next page"
          className="rounded-r-lg border border-gray-400 px-3 py-3 cursor-not-allowed"
        />
      )}
    </div>
  );
};

export default Pagination;
