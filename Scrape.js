const cheerio = require("cheerio");

async function scrape(url) {
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);
    let contentData = [];

    if($("article").length){
      $("article").each((i, el) => {
        const content = $(el).find("p").text(); // Extract paragraphs
        contentData.push(  content );
      });
    }

    if (contentData.length === 0 && $("div p").length) {
      $("div p").each((i, el) => {
        const content = $(el).text().trim();
        if (content) contentData.push(content);
      });
    }

    if (contentData.length === 0 && $("p").length) {
      $("p").each((i, el) => {
        const content = $(el).text().trim();
        if (content) contentData.push(content);
      });
    }

    return contentData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

module.exports = scrape;
