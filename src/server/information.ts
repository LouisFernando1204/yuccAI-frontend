import axios from "axios";

export const askToYuccAI = async (question: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_PYTHON_API_URL}/query`,
      { query_text: question }
    );
    console.log("YuccAI Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return "Failed to get Answer from YuccAI.";
  }
};

export const addNewInformation = async (
  question: string,
  answer: string,
  answersource: string
) => {
  try {
    const result = await axios.post(
      `${import.meta.env.VITE_GOLANG_API_URL}/api/add_informatio`,
      {
        question: question,
        answer: answer,
        answersource: answersource,
      }
    );
    console.log("History Added: ", result);
  } catch (error) {
    console.log(error);
  }
};
