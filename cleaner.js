const scrapeData = require("./scrapers/odi-website.js");

async function cleanWebsiteScrape(type) {
  let page = await scrapeData.scrape(type, 1);

  const convertFormat = (d) => {
    let date = d.slice(4);

    date = date.replace(/,/g, "");

    final =
      date.split(" ")[1] + "/" + date.split(" ")[0] + "/" + date.split(" ")[2];

      console.log(final)
    if (final.includes("Jan")) {
      let monthC = final.replace(/Jan/g, "01");
      return monthC
    }

    if (final.includes("Feb")) {
      let monthC = final.replace(/Feb/g, "02");
      return monthC
    }

    if (final.includes("Mar")) {
      let monthC = final.replace(/Mar/g, "03");
      return monthC
    }

    if (final.includes("Apr")) {
      let monthC = final.replace(/Apr/g, "04");
      return monthC
    }

    if (final.includes("May")) {
      let monthC = final.replace(/May/g, "05");
      return monthC
    }

    if (final.includes("Jun")) {
      let monthC = final.replace(/Jun/g, "06");
      return monthC
    }

    if (final.includes("Jul")) {
      let monthC = final.replace(/Jul/g, "07");
      return monthC
    }

    if (final.includes("Aug")) {
      let monthC = final.replace(/Aug/g, "08");
      return monthC
    }

    if (final.includes("Sep")) {
      let monthC = final.replace(/Sep/g, "09");
      return monthC
    }

    if (final.includes("Oct")) {
      let monthC = final.replace(/Oct/g, "10");
      return monthC
    }

    if (final.includes("Nov")) {
      let monthC = final.replace(/Nov/g, "11");
      return monthC
    }

    if (final.includes("Dec")) {
      let monthC = final.replace(/Dec/g, "12");
      return monthC
    }

  };

  for (let i = 0; i < page.length; i++) {
    page[i].title = page[i].title.join("");
    page[i].synopsis = page[i].synopsis.join("");
    page[i].categories = page[i].categories.join(", ");
    page[i].author = page[i].author.join(", ");
    page[i].date = convertFormat(page[i].date.join(""));
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
