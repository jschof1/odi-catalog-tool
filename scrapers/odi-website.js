const {
  Scraper,
  Root,
  OpenLinks,
  CollectContent,
} = require("nodejs-web-scraper");

async function scrape(type, pageNumbers) {
  let pages = [];

  const getPageObject = (pageObject, address) => {
    pages.push({
      ...pageObject,
      address,
      type: type,
    });
  };

  const config = {
    baseSiteUrl: `https://theodi.org/`,
    startUrl: `https://theodi.org/knowledge-opinion/${type}/`,
    filePath: "./images/",
    logPath: "./logs/",
  };

  const scraper = new Scraper(config);
  const root = new Root({
    pagination: { queryString: "page", begin: 0, end: pageNumbers },
  });

  const articles = new OpenLinks("a.o_card--blog", {
    name: "url",
    getPageObject,
  });

  const docUrl = new OpenLinks("a.m_cta", {
    name: "docUrl",
  });

  const story = new CollectContent("div.wpb_content_element ", {
    name: "story",
  });
  const synopsis = new CollectContent("section.o_page-synopsis ", {
    name: "synopsis",
  });

  const condition = (cheerioNode) => {
    const text = cheerioNode.text().trim(); //Get the innerText of the <a> tag.
    if (text !== "Related") {
      return true;
    }
  };

  const titles = new CollectContent(
    "div.o_page-header__inner h1.m_page-title",
    {
      name: "title",
      condition,
    }
  );
  const categories = new CollectContent("li.m_topic", {
    name: "categories",
  });

  const date = new CollectContent("div.m_page-date", {
    name: "date",
  });

  const author = new CollectContent("ul.o_page-contributors li h1", {
    name: "author",
  });

  root.addOperation(articles);
  if (type === "reports" || type === "guides") {
    articles.addOperation(docUrl);
  }
  articles.addOperation(titles);
  articles.addOperation(synopsis);
  articles.addOperation(categories);
  articles.addOperation(story);
  articles.addOperation(author);
  articles.addOperation(date);

  await scraper.scrape(root);

  return pages;
}

// scrape("reports", 1);

module.exports = {
  scrape,
};
