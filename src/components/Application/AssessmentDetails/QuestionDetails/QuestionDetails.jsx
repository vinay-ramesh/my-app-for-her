import React, { useRef, useState, useEffect } from 'react';
import Questions from './Questions/Questions';
import StudentList from './StudentList/StudentList';

const StudyCircleDetails = ({ isDataAvailable, questionList, studentList, studyCircleId }) => {
  const [containerHeight, setContainerHeight] = useState(750);
  const questionsRef = useRef(null);

  useEffect(() => {
    const questionsElement = questionsRef.current;

    // Create a new ResizeObserver instance
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === questionsElement) {
          // Update containerHeight when the height of the `Questions` element changes
          setContainerHeight(entry.contentRect.height);
        }
      }
    });

    // Observe the `Questions` container's dimensions
    if (questionsElement) {
      resizeObserver.observe(questionsElement);
    }

    // Cleanup the observer on component unmount
    return () => {
      if (questionsElement) {
        resizeObserver.unobserve(questionsElement);
      }
    };
  }, [questionList, studentList]);

  return (
    <main
      className="grid grid-cols-[4fr_2fr] sm:grid-cols-1 md:grid-cols-1 gap-4 h-full pb-4
     "
    >
      {/* Dynamic First Container (Questions) */}
      <div ref={questionsRef} className="h-fit grid grid-cols-1 sm:row-[2] md:row-[2]">
        <Questions questionList={questionList} isDataAvailable={isDataAvailable} studyCircleId={studyCircleId} />
      </div>

      {/* Scrollable Second Container (StudentList) */}
      <div className="overflow-auto " style={{ maxHeight: containerHeight }}>
        <StudentList studentList={studentList} />
      </div>
    </main>
  );
};

export default StudyCircleDetails;
