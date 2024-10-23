import React, { useState, useEffect } from 'react';
import { assessmentQuestionDetails } from '../../../../../api/AssesmentDetails';
import { assessmentQuestionsSectionResponseDetails } from '../../../../../api/AssesmentDetails';
import { useParams } from 'react-router-dom';
import CarousalSection from './QuestionDetailsChild/CarouselSection/CarousalSection';
import QuestionImage from './QuestionDetailsChild/QuestionImage/QuestionImage';
import QuestionDescription from './QuestionDetailsChild/QuestionDescription/QuestionDescription';
import QuestionAnswerSection from './QuestionDetailsChild/QuestionAnswerSection/QuestionAnswerSection';
import QuestionChartSection from './QuestionDetailsChild/QuestionChartSection/QuestionChartSection';
import QuestionResponseDetails from './QuestionDetailsChild/QuestionResponseDetails/QuestionResponseDetails';
import QuestionNoData from './QuestionDetailsChild/QuestionNoData/QuestionNoData';

const Questions = ({ isDataAvailable, questionList, studyCircleId }) => {
  const { id } = useParams();
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [questionDetails, setQuestionDetails] = useState(null);
  const [questionReportData, setQuestionReportData] = useState([]);
  const [answerJson, setAnswerJson] = useState([]);
  useEffect(() => {
    if (questionList?.length > 0) {
      setSelectedQuestion(questionList?.[0]?.question_id);
    }
  }, [questionList]);
  let sum =
    questionDetails?.count_correct_responses +
    questionDetails?.count_near_correct_responses +
    questionDetails?.count_incorrect_responses +
    questionDetails?.count_not_answered_responses;
  let sumGsc =
    questionDetails?.count_correct_responses_gsc +
    questionDetails?.count_near_correct_responses_gsc +
    questionDetails?.count_incorrect_responses_gsc +
    questionDetails?.count_not_answered_responses_gsc;
  const calculatePercentage = (value, totalValue) => {
    return (value * 100) / totalValue;
  };
  const getBarchart = () => {
    return {
      labels: ['Correct', 'Near Correct', 'Incorrect', 'Not Answered'],
      datasets: [
        {
          label: 'My Class',
          data: [
            calculatePercentage(questionDetails?.count_correct_responses, sum),
            calculatePercentage(questionDetails?.count_near_correct_responses, sum),
            calculatePercentage(questionDetails?.count_incorrect_responses, sum),
            calculatePercentage(questionDetails?.count_not_answered_responses, sum),
          ],
          backgroundColor: ['#BCF0DA', '#C3DDFD', '#FBD5D5', '#E5E7EB'],
          // barPercentage: 0.3,
        },
        {
          label: 'Group',
          data: [
            calculatePercentage(questionDetails?.count_correct_responses_gsc, sumGsc),
            calculatePercentage(questionDetails?.count_near_correct_responses_gsc, sumGsc),
            calculatePercentage(questionDetails?.count_incorrect_responses_gsc, sumGsc),
            calculatePercentage(questionDetails?.count_not_answered_responses_gsc, sumGsc),
          ],
          backgroundColor: ['#0E9F6E', '#1C64F2', '#E02424', '#9CA3AF'],
          // barPercentage: 0.3,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: false,
    animation: {
      onComplete: (context) => {
        const chart = context?.chart;
        const { ctx } = chart;
        ctx.save();
        console.log(chart.data.datasets, 'chartData');
        // Loop through both datasets (0 for "My Class", 1 for "Group")
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const meta = chart.getDatasetMeta(datasetIndex);

          meta.data.forEach((bar, index) => {
            const dataValue = dataset.data[index]; // Get the data value for the bar

            // Get the bar's position (its center point)
            const barPosition = bar.getCenterPoint();
            const yBase = bar.base;

            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000';
            ctx.textBaseline = 'bottom';

            // Display the total just above the bar
            ctx.fillText(`${dataValue.toFixed(0)}%`, barPosition.x, yBase - 20);
          });
        });

        ctx.restore();
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'left',
        title: {
          display: true,
        },
        labels: {
          boxWidth: 15,
          boxHeight: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${value.toFixed(2)}%`;
          },
        },

        enabled: true,
      },
    },

    scales: {
      y: {
        barThickness: 6,
        stacked: false,
        beginAtZero: true,
        // max: 100,
        min: 0,
        ticks: {
          font: {
            size: 12,
            weight: 'bold',
          },
          color: '#000000',
          stepSize: 10,
          callback: (value) => (value > 100 ? '' : `${value}%`),
        },
        grid: {
          borderDash: [5, 6],
          color: '#e8dcdc',
        },
      },
      x: {
        barThickness: 6,
        stacked: false,
        ticks: {
          font: {
            size: 13,
            weight: '600',
          },
          color: '#000000',
          maxTicksLimit: 20,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const getQuestionDetails = async () => {
    const res = await assessmentQuestionDetails(id, studyCircleId, selectedQuestion);
    const questionReport = await assessmentQuestionsSectionResponseDetails(id, studyCircleId, selectedQuestion);
    console.log(res);
    if (res?.question_id) {
      setQuestionDetails(res);
      setQuestionReportData(questionReport);
      setAnswerJson(JSON.parse(res?.answer_json));
    }
  };
  useEffect(() => {
    if (selectedQuestion > 0) {
      console.log('qwerty');

      getQuestionDetails();
    }
  }, [selectedQuestion]);

  console.log(questionDetails, selectedQuestion, 'question-list');

  const handleChange = (e) => {
    setSelectedQuestion(e);
    // getQuestionDetails();
  };
  console.log(questionReportData, questionDetails, isDataAvailable, 'questionReportData');
  return (
    <section className="">
      <section>
        <div>
          <CarousalSection
            isDataAvailable={isDataAvailable}
            questionList={questionList}
            handleChange={handleChange}
            selectedQuestion={selectedQuestion}
          />
          {questionDetails ? (
            <>
              <QuestionImage questionDetails={questionDetails} />
              <QuestionDescription questionDetails={questionDetails} />
              <QuestionAnswerSection answerJson={answerJson} />
              <QuestionChartSection getBarchart={getBarchart} options={options} />
              <QuestionResponseDetails questionReportData={questionReportData} />
            </>
          ) : (
            <QuestionNoData />
          )}
        </div>
      </section>
    </section>
  );
};

export default Questions;
