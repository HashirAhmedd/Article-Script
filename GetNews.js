const dotenv = require("dotenv");
const scrape = require("./Scrape");
dotenv.config();

const query =
  '("Artificial Intelligence" OR "Machine Learning") AND ("AI Ethics" OR "Deep Learning")';

  const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const formatted = yesterday.toISOString().split('T')[0];
console.log(formatted);


const fromDate = formatted
const tillDate = formatted


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