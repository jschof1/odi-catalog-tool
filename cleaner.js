const scrapeData = require("./scrapers/odi-website.js");

async function cleanWebsiteScrape(type) {
  let page = await scrapeData.scrape(type, 1);

  for (let i = 0; i < page.length; i++) {
    page[i].title = page[i].title.join("");
    page[i].synopsis = page[i].synopsis.join("");
    page[i].categories = page[i].categories.join(", ");
    page[i].author = page[i].author.join(", ");
    page[i].date = page[i].date.join("");
    page[i].story = page[i].story.join("");
    if (page[i].docUrl !== undefined) {
      let fixedAddress = page[i].docUrl.map((docUrl) => {
        let keyRemoved = Object.values(docUrl);
        return keyRemoved;
      });
      page[i].docUrl = fixedAddress.flat().join(", ");
    }
  }

  console.log(page);
  return page;
}

module.exports = {
  cleanWebsiteScrape,
};
