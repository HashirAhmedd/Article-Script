const cheerio = require("cheerio");

async function scrape(url) {
  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);

    let contentData = [];

    $("article").each((i, el) => {
      const content = $(el).find("p").text(); // Extract paragraphs
      contentData.push(  content );
    });

    return contentData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

module.exports = scrape;
