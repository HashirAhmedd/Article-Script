const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getTitle(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(
    `Analyze the given content and generate an effective short title of around 7-10 words maximun. Ensure it is a neutral and accurate representation of the content. Respond only with the title no explanations, headings, or summaries, just plain text. Here is Content: ${content}`
  );
  const response = await result.response;
  return response.text();
}

module.exports = getTitle;
