


const calais = require("opencalais-tagging");
const addTags = require("../airtable-connecters/attach-tags-airtable.js");
const token2 = process.env["API_TOKEN2"];
require("dotenv").config();

const loadAndFetch = async (recNums, arrToUpdate, nameOfBase) => {
  let fileData = await arrToUpdate;
  let descriptions = [];
  
  for (let i = 0; i < recNums; i++) {
    let description = fileData[i].YouTubeDescription;
    descriptions.push(description);
  }

  let arr = [];
  let i = -1;

  const interval = setInterval(async () => {
    let arr2 = [];
    i += 1;
    // choose how many requests you want to make - REMEMBER you are limited to 500 per day
    if (i === 2) {
      addTags.airtableAppend(arr, nameOfBase);
      clearInterval(interval);
    }
    try {
      const options = {
        content: descriptions[i],
        accessToken: token2,
      };

      const allData = await calais.tag(options);
      delete allData.doc;

      let calaisResponse = Object.values(allData);
      const allNames = calaisResponse.filter((obj) => obj.name);

      for (let x of allNames) {
        if (
          x._type === "Person" ||
          x._type === "Company" ||
          x._type === "Organization" ||
          x._typeGroup === "socialTag" ||
          x._typeGroup === "topics"
        ) {
          arr2.push(x.name);
        }
      }
      // console.log(arr2)
      return arr.push({ [i]: arr2 });
    } catch (err) {
      return arr.push({ [i]: ["DESCRIPTION EMPTY"] });
    }
  }, 2000);
};

module.exports = {
  loadAndFetch,
};