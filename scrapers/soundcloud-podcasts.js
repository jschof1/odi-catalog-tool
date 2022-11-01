const SoundCloud = require("soundcloud-scraper");
const client = new SoundCloud.Client();
const puppeteer = require("puppeteer");
const tagger = require("../tagger/smart-tagger.js");
const createAirtable = require("../airtable-connecters/add-new-fields-airtable.js");
const { run } = require("googleapis/build/src/apis/run/index.js");

const extractItems = () => {
  let items = [];
  document
    .querySelectorAll("div.soundTitle__usernameTitleContainer > a")
    .forEach((link) => {
      items.push(link.href);
    });
  return items;
};

async function scrapeItems(page, extractItems, itemCount, scrollDelay = 800) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      await page.waitForTimeout(scrollDelay);
    }
  } catch (e) {}
  return items;
}

async function scrollAndReturn() {
  // Set up Chromium browser and page.
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  // Navigate to the example page.
  await page.goto("https://soundcloud.com/theodi");

  // Auto-scroll and extract desired items from the page. Currently set to extract ten items.
  const items = await scrapeItems(page, extractItems, 5);

  // console.log(await items)
  await browser.close();
  // if item contains the word sets then remove it from the array
  let filteredItems = items.filter((item) => !item.includes("sets"));
  console.log(filteredItems);
  return filteredItems;
}

const findType = async (details) => {
  if (await details.includes("ODI Summit")) {
    return "ODI Summit";
  } else if (await details.includes("ODI Futures")) {
    return "ODI Podcast";
  } else if (await details.includes("Canalside Chats")) {
    return "ODI Research";
  } else if (await details.includes("ODI Fridays")) {
    return "ODI Fridays";
  } else {
    return "N/A";
  }
};

// loop through links and call soundcloud api
const getSongArrInfo = async () => {
  let songArr = await scrollAndReturn();
  try {
    let songArrInfo = [];
    for await (let song of songArr) {
      let songInfo = await client.getSongInfo(song);
      songArrInfo.push(songInfo);
    }
    // clean song info. create object with title, descirption, thumbnail, url, thumbnail, duration, playcount, likes, comments title, artist, url
    let cleanSongArrInfo = songArrInfo.map((song) => {
      return {
        Title: song.title,
        "Event / Series": "N/A",
        Description: song.description,
        Thumbnail: song.thumbnail,
        URL: song.url,
        Duration: song.duration.toString(),
        "Play Count": song.playCount,
        Likes: song.likes,
        Upload: song.publishedAt.toString(),
        Tags: [],
        Type: ["Podcast"],
      };
    });
    return cleanSongArrInfo;
  } catch (e) {
    console.log(e);
  }
};

const runSoundCloudScrape = async () => {
  let myResult = await getSongArrInfo();
  createAirtable.uploadToAirtable("Podcasts", myResult);
};

runSoundCloudScrape();

module.exports = {
  runSoundCloudScrape,
};
