const Airtable = require('airtable');
require("dotenv").config({ path: "../.env" });
const cleaner = require('../cleaner.js');

// this function is used to upload the odi article data to airtable the structure of the data is different from the other data at the moment.  it includes the title, synopsis, categories, author, date, story, document url, type and address it loops through the cleaned data and creates a new record in the airtable table with the data 

const apiKey = process.env["AIRTABLE_API_KEY"];
const baseId = process.env["AIRTABLE_BASE_ID"];

const base = new Airtable({apiKey}).base(baseId);

async function exportArticles(type) {
   let page = await cleaner.cleanWebsiteScrape("news");
   console.log(page)

    // insert JSON data into airtable
    for (let i = 0; i < page.length; i++) {
        base(type).create([{
        "fields" : {
            "Title": page[i].title,
            "Synopsis" : page[i].Synopsis,
            "Categories": page[i].categories.split(', '),
            "Author": page[i].author.split(', '),
            "Date": page[i].date.split(" ").slice(1).reverse().join("-").replace(/,/g, ""),
            "Story": page[i].story,
            "Document URL": page[i].docUrl,
            "Type": page[i].type,
            "Address": page[i].address
        }}], function(err, record) {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
}

module.exports = {
    exportArticles
}




