const Airtable = require("airtable");
require("dotenv").config({ path: "../.env" });

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
