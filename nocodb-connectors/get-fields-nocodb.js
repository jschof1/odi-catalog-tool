const fetch = require("node-fetch");
const env = require("dotenv").config();
const key = process.env.NOCO_API_KEY;


let url =
  "https://mysterious-bayou-54085.herokuapp.com/api/v1/db/data/noco/p_ocwwv0j4mw51k6/All-resources/views/All%20resources?offset=0&limit=25&where=";
let options = {
  method: "GET",
  headers: {
    "xc-auth": key
  },
};
const getResults = async () => {
  try {
    const res = await fetch(url, options);
    const json = await res.json();
    const data = await json;

    return await data;
  } catch (error) {
    console.log(error);
  }
}
// loop through list of resources
const loopResources = async () => {
  const resources = await getResults()
  console.log(resources)
  for (let i = 0; i < resources.length; i++) {
    resources[i].Title
  }
};

const main = async () => {
  await loopResources();
};

main();
