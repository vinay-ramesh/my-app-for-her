import CryptoJS from 'crypto-js';

// Please Send Input as this {
// assessment_mode_id ,
// assessment_type_id ,
// assessment_organizer_id ,
// assessment_subject_id ,
// question_sub_subject_id ,
// question_topic_id ,
// question_sub_topic_id ,
// question_object
// }

export const GenerateHash = (inputs) => {
  const inputString = [
    inputs?.assessment_mode_id || null,
    inputs?.assessment_type_id || null,
    inputs?.assessment_organizer_id || null,
    inputs?.assessment_subject_id || null,
    inputs?.question_sub_subject_id || null,
    inputs?.question_topic_id || null,
    inputs?.question_sub_topic_id || null,
    inputs?.question_objective_id || null,
  ]
    .map((param) => (param !== null && param !== undefined ? param.toString() : 'null'))
    .join('-');

  // console.log(inputString);
  // Ensure the input is interpreted as a UTF-8 encoded string
  const utf8Input = CryptoJS.enc.Utf8.parse(inputString);
  // Use CryptoJS.MD5 to create a hash
  const hash = CryptoJS.MD5(inputString).toString(CryptoJS.enc.Hex);

  return hash;
};
