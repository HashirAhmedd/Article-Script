const getArticles = require("./GetNews");
const optimizeContent = require("./OptimizeContent");
const getPreviewText = require("./GerPreviewText");
const getKeywords = require("./Keywords");
const groupArticle = require("./GroupArticles");
const getTitle = require("./GetTitle");

async function processContent() {
  try {
    const articles = await getArticles();
    const groupedArticlesContent = await groupArticle(articles);
    let counter = 1;
    const optimizedArticles = [];
    console.log("Total Articles Length", groupedArticlesContent.length);
    for (const article of groupedArticlesContent) {
      if (article && article.replace(" ", "").length > 40) {
        console.log(`Starting processing article ${counter} ... `);
        const optimizedContent = await optimizeContent(article.slice(20));
        optimizedArticles.push({
          title: await getTitle(optimizedContent),
          Time: article.slice(0, 20),
          content: optimizedContent,
          previewText: await getPreviewText(optimizedContent),
          keywords: await getKeywords(optimizedContent),
        });
        counter++;
        console.log("Waiting 30 seconds before processing the next article...");
        await new Promise((resolve) => setTimeout(resolve, 30000));
      }
    }
    return optimizedArticles; // [ {title, previewText, content, Time, keywords} ]
  } catch (error) {
    console.error("Error processing content:", error);
  }
}

processContent().then((optimizedArticles) => {
  console.log("Starting Sending Data To DB");
  //storing optimized articles into db
  for (article of optimizedArticles) {
    if (article) {
      fetch("https://gen-ai-backend-nine.vercel.app/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
    }
  }
});
