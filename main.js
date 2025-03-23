const getArticles = require("./GetNews");
const optimizeContent = require("./OptimizeContent");
const getPreviewText = require("./GerPreviewText");
const getKeywords = require("./Keywords");

async function processContent() {
  try {
    const articles = await getArticles();
    let counter  = 1;
    const optimizedArticles = [];
    console.log("Total Articles Length",articles.length)
    for (const article of articles) {
      if (article.content) {
        console.log(`Starting processing article ${counter} ... `);
        const optimizedContent = await optimizeContent(article.content);
        optimizedArticles.push({
          title: article.title,
          Time: article.Time,
          content: optimizedContent,
          previewText: await getPreviewText(optimizedContent),
          keywords: await getKeywords(optimizedContent),
        });
        counter++;
        console.log("Waiting 6 seconds before processing the next article...");
        await new Promise((resolve) => setTimeout(resolve, 6000));
      }
    }
    return optimizedArticles; // [ {title, previewText, content, Time, keywords} ]
  } catch (error) {
    console.error("Error processing content:", error);
  }
}

processContent().then((optimizedArticles) => {
  console.log("Starting Sending Data To DB")
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
