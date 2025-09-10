const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function optimizeContent(content) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(`Respond only with the revised content, without extra headings or filler. Use the article provided to create a professional yet engaging summary that feels natural to read.

Begin with 2–3 bullet points highlighting the most important takeaways.

Then, write a clear and concise summary (250–350 words) that explains the key facts in plain language.

Maintain an informative, journalistic tone—factual but approachable.

Incorporate data points, research findings, or expert quotes if present.

Focus on what matters most for businesses or consumers, avoiding unnecessary detail.

Explain technical terms briefly, but keep the flow smooth and easy to read.

The summary should feel like it was written by a human reporter: professional, concise, and engaging.

Here is the article content:
${content}`);
  const response = await result.response;
  return response.text().replace(/^(Here is your response:|Sure!|.*?\n\n)/i, "").trim();
}

module.exports = optimizeContent;
