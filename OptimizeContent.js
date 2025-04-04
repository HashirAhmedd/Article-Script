const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function optimizeContent(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(`Respond only with the revised content, without any headings or additional text. Extract the main content from the article without any introductions, summaries, or additional comments. Summarize the article in a concise, informative manner:
Format your response as follows:
1. Start with 2-3 bullet points highlighting the key takeaways
2. Follow with a concise summary (250-350 words) that captures the essential information
3. Focus on facts rather than opinions
4. Maintain a professional, journalistic tone
5. Include any relevant data points, research findings, or expert quotes
6. Highlight practical implications for the  businesses, or consumers
7. Avoid technical jargon where possible, or briefly explain technical terms
The summary should be engaging but straightforward, providing value to readers who want to quickly understand the main points without reading the entire original article.
here is you article content: ${content} `);
  const response = await result.response;
  return response.text().replace(/^(Here is your response:|Sure!|.*?\n\n)/i, "").trim();
}

module.exports = optimizeContent;
