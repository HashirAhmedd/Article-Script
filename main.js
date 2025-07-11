const getArticles = require("./GetNews");
const optimizeContent = require("./OptimizeContent");
const getPreviewText = require("./GerPreviewText");
const getKeywords = require("./Keywords");
const groupArticle = require("./GroupArticles");
const getTitle = require("./GetTitle");
const getImage = require("./GetImage");

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
        const previewText = await getPreviewText(optimizedContent);
        optimizedArticles.push({
          title: await getTitle(optimizedContent),
          Time: article.slice(0, 20),
          content: optimizedContent,
          previewText,
          keywords: await getKeywords(optimizedContent),
          image_url: await getImage(previewText),
        });
        if (optimizedArticles[counter-1]) {
          //storing current article
          console.log(`Storing article ${counter} into DB`);
          fetch("https://gen-ai-backend-nine.vercel.app/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(optimizedArticles[counter-1]),
          });
          console.log(`Article ${counter} stored in DB`);
        }
        counter++;
        console.log("Waiting 60 seconds before processing the next article...");
        await new Promise((resolve) => setTimeout(resolve, 60000));
      }
    }
    return optimizedArticles; // [ {title, previewText, content, Time, keywords, image_url} ]
  } catch (error) {
    console.error("Error processing content:", error);
  }
}

processContent().then((optimizedArticles) => {
  if(optimizedArticles){
    console.log("All articles stored in DB");
  }
});
