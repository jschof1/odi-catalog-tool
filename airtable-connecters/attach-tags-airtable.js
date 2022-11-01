const Airtable = require("airtable");
require("dotenv").config({ path: "../.env" });

const apiKey = process.env["AIRTABLE_API_KEY"];
const baseId = process.env["AIRTABLE_BASE_ID"];

// this function attaches tha Open Calais PermID intelligent tags to the airtable records the tags return a set of objects with index as its key and the tags as its value in an array the the first function converts the object to an array, removing the keys and then flattens the array to a single array of tags the second function then attaches the tags to the airtable records

function airtableAppend(fileData, baseName){
let descArr = fileData
  .map(d => Object.keys(d).map((key) => d[key]))
  .reduce((a, b) => a.concat(b), [])
  .map(d => d.map((e) => e.replace(/_/g, " ")));

const allRecords = [];

const base = new Airtable({ apiKey }).base(baseId);

base(baseName)
  .select({
    view: "Grid view",
  })
  .eachPage(function page(records, fetchNextPage) {
    records.forEach((record) => allRecords.push(record.id));
    fetchNextPage();
  })
  .then(() => {
    for (let i = 0; i < descArr.length; i++) {
      base(baseName).update(
        {
          test: descArr[i].split(', '),
        },
        function (err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );
    }
  });
}

module.exports = {
    airtableAppend,
}