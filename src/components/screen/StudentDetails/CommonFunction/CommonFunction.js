// Function used to calculate Percentage
export const calculatePercentage = (value, totalVal) => {
  return (value / totalVal) * 100;
};

// function used in Students Details Read Velocity Bar Chart
export const getDifficultyLevelChartValues = (values) => {
  const chartValues = {
    difficulty: [],
    correct: [],
    nearCorrect: [],
    incorrect: [],
    notAnswered: [],
    totalValue: [],
  };
  if (values?.length !== 0) {
    const data = values;
    const dataSoretd = data?.sort((a, b) => {
      return a?.question_difficulty_level > b?.question_difficulty_level ? 1 : -1;
    });
    dataSoretd?.map((i) => {
      chartValues?.difficulty.push(i?.question_difficulty_level);
      chartValues?.correct.push(calculatePercentage(i?.count_correct_responses, i?.count_total_responses));
      chartValues?.nearCorrect.push(calculatePercentage(i?.count_near_correct_responses, i?.count_total_responses));
      chartValues?.incorrect.push(calculatePercentage(i?.count_incorrect_responses, i?.count_total_responses));
      chartValues?.notAnswered.push(calculatePercentage(i?.count_not_answered_responses, i?.count_total_responses));
      chartValues?.totalValue.push(i?.count_total_responses);
    });
    return chartValues;
  } else {
    return chartValues;
  }
};
