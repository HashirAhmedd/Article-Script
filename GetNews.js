const dotenv = require("dotenv");
const scrape = require("./Scrape");
dotenv.config();

const query =
  '("Artificial Intelligence" OR "Machine Learning") AND ("AI Ethics" OR "Deep Learning")';

const fromDate = '2025-03-20';   //YYYY-MM-DD
const tillDate = '2025-04-04';   //YYYY-MM-DD


const getArticles = async () => {
  const response = await fetch(
         `https://newsapi.org/v2/everything?q=${query}&language=en&from=${fromDate}&to=${tillDate}&apiKey=${process.env.NEWS_API_KEY}`  
  );
  const { articles } = await response.json();
  let articlesContent = [];
  for (const [index, article] of articles.entries()) {
      let content = await scrape(article.url);
      content = content.reduce((max, word) => word.length > max.length ? word : max, "");
      articlesContent.push({ title: article.title, content, Time: article.publishedAt });
  } 
  return articlesContent
};


module.exports = getArticles;