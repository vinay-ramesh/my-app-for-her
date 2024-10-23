import CryptoJS from 'crypto-js';

export const GenerateHash = (inputs) => {
  const inputString = inputs?.map((param) => (param !== null && param !== undefined ? param.toString() : 'null')).join('-');

  // Ensure the input is interpreted as a UTF-8 encoded string
  const utf8Input = CryptoJS.enc.Utf8.parse(inputString);
  // Use CryptoJS.MD5 to create a hash
  const hash = CryptoJS.MD5(inputString).toString(CryptoJS.enc.Hex);
  return hash;
};

export const combineArrays = (obj) => {
  const results = [];
  const hashedValues = [];
  const keys = Object.keys(obj);

  function backtrack(index, current, hashed) {
    if (index === keys.length) {
      results.push(current);
      hashedValues?.push(GenerateHash(current));
      return;
    }

    const currentKey = keys[index];
    for (const item of obj[currentKey]) {
      //   GenerateHash(current.concat(item));
      backtrack(index + 1, current.concat(item));
    }
  }

  backtrack(0, [], []);
  return hashedValues;
};
// {
// assessment_mode_id: [2];
// assessment_organizer_id: [null];
// assessment_subject_id: [89, 50, 12, 26, 94, 168, 136, 220, 189];
// assessment_type_id: [null];
// question_objective_id: [null];
// question_sub_subject_id: [null];
// question_sub_topic_id: [null];
// question_topic_id: [null];
// }
