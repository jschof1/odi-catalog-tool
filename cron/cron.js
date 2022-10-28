const schedule = require("node-schedule");
const ytScrape = require("../scrapers/youtube-videos.js");
const scScrape = require("../scrapers/soundcloud-podcasts.js");
// const linkChecker = require("../link-checker.js");
const scraper = require("../scrapers/odi-website.js");
const cleaner = require("../cleaner.js");


const previousScrapeDate = new Date("2022-10-01T00:00:00.000Z");
const currentDate = new Date();
let scrape;
currentDate - previousScrapeDate > 604800000
  ? (scrape = true)
  : (scrape = false);

let odi = ["explainers", "reports", "guides", "news"];

function scrapeAndExportOdiWebsite() {
  if (scrape) {
    odi.forEach((type) => {
      scraper.scrape(type, 1, previousScrapeDate);
    });
  }
}
function cleanAndExportOdiWebsite() {
    odi.forEach((type) => {
        cleaner.clean(type);
    });
}
schedule.scheduleJob("0 0 0 * * 0", function () {
  // linkChecker.runChecker();
  scrapeAndExportOdiWebsite();
  cleanAndExportOdiWebsite();
  ytScrape.runYoutubeScrape();
  scScrape.runSoundCloudScrape();
});
