const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const groupArticles = async (articles) => {
  const articleTitles = articles.map((article) => article.title).join("\n");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(
    `Analyze the following article titles and group them based on similar topics.  
     Output an array where each group contains concatenated article titles.  
     Format strictly as JSON: [["Title1", "Title5", "Title7"], ["Title2", "Title6", "Title8"]].  
     Do not include explanations or extra text.  
     Here are the article titles: ${articleTitles}`
  );

  const response = await result.response;
  const text = response.candidates[0]?.content || "[]"; // Handle empty response

  const cleanedText = text.parts[0].text.replace(/```json\n|\n```/g, "").trim();

  try {
    const groupedArticles = JSON.parse(cleanedText);
    let mergedContent = [];
    for (const articlesTitles of groupedArticles) {
      let first = true;
      let content = "";
      for (const article of articles) {
        if (articlesTitles.includes(article.title)) {
          if(first){
            content+=article.Time;
            first = false;
          }
          content += article.content;
        }
      }
      mergedContent.push(content);
    }
    return mergedContent;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
};

module.exports = groupArticles;
