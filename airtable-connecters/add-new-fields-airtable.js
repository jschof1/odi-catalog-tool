const Airtable = require("airtable");
require("dotenv").config({ path: "../.env" });

// This function is used to upload data to airtable it takes in the base name and the data to be uploaded it creates a new table in airtable with the base name it creates a new record in the table with the data it returns a promise that resolves when the data is uploaded to airtable

const apiKey = process.env["AIRTABLE_API_KEY"];
console.log(apiKey);
const baseId = process.env["AIRTABLE_BASE_ID"];

const uploadToAirtable = async (baseName, data) => {
  const base = new Airtable({ apiKey }).base(baseId);
  const table = base(baseName);
  const records = data.map((obj) => ({
    fields: obj,
  }));
  try {
    await table.create(records);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  uploadToAirtable,
};
