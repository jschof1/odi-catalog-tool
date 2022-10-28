const Airtable = require('airtable');
require("dotenv").config({ path: "../.env" });
const cleaner = require('../cleaner.js');

// write markdown about this function
// this function is used to upload the odi article data to airtable
// the structure of the data is different from the other data at the moment. 
// it includes the title, synopsis, categories, author, date, story, document url, type and address
// it loops through the cleaned data and creates a new record in the airtable table with the data

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

exportArticles('News');


// Wed Mar 30, 2022 conver to YYYY-MM-DD format

// remove day of week
const date = "Wed Mar 30, 2022";


// remove first day of week, move the year at the end and add a hyphen between the month and day and convert the month to a number


// convert string to an array, if comma is present split the array into two
const str = 'hello, world';
str.split(', ');

// convert a string to an array






// module.exports = {
//     exportArticles
// }




