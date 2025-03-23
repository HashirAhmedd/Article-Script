const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getPreviewText(content) {
  if (!content || content.trim().length === 0) {
    return "No preview available.";
  }
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(`Read the content thoroughly and provide an interesting preview text of no more than 2 lines. Just the text, no headings or additional information, Respond only with the preview text, without any headings or additional text. Extract the main content from the article without any introductions, summaries, or additional comments. Here is the content: ${content}`);
  const response = await result.response;
  return response.text();
}

module.exports = getPreviewText;
