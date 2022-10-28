const { google } = require("googleapis");
const ytbTags = require("youtube-tags");
const uploadFields = require("../airtable-connecters/add-new-fields-airtable.js");
const fetchTag = require("../tagger/smart-tagger");
require("dotenv").config({ path: "../.env" });


const youtubeAPIKey = process.env["YOUTUBE_API_KEY"];

let scrapeNum = 2;
const youtube = google.youtube({
  version: "v3",
  auth: youtubeAPIKey,
});

const getVideoDetails = async (videoId) => {
  const response = await youtube.videos.list({
    part: "snippet",
    id: videoId,
  });
  
  return response.data.items[0].snippet;
};

const tag = async () => {
  const videoDetails = await getVideoDetails(videoId);
};

const getVideoStats = async (videoId) => {
  const response = await youtube.videos.list({
    part: "statistics",
    id: videoId,
  });
  return response.data.items[0].statistics;
};



let ODI = "UCnNmia8FaXDeGAqZNQEF2RA";

const getChannelVideos = async (channelId) => {
  const response = await youtube.search.list({
    channelId,
    part: "snippet",
    order: "date",
    maxResults: scrapeNum,
  });
  console.log('response', await response.data)
  return response.data.items;
};

// get video id of every video in the channel
const getVideoIds = async (channelId) => {
  const videos = await getChannelVideos(channelId);
  console.log(videos)
  return videos.map((video) => video.id.videoId);
};


// const getSmartTags = async () => {

// find type
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

const getVideoData = async () => {
  let ids = await getVideoIds(ODI);
  videoIds = ids.filter((videoId) => videoId !== undefined);
  let final = videoIds.map(async (videoId) => {
    const videoDetails = await getVideoDetails(videoId);
    const videoStats = await getVideoStats(videoId);
    const tags = await ytbTags.getYoutubeTags(videoId);
    const type = await findType(videoDetails.title);
    const video = {
      Title: videoDetails.title,
      YouTubeDescription: videoDetails.description,
      Tags: tags.join(", ").split(', '),
      "Event / Series": type,
      Description: videoDetails.description,
      viewCount: videoStats.viewCount,
      likeCount: videoStats.likeCount,
      commentCount: videoStats.commentCount,
      Url: `https://www.youtube.com/watch?v=${videoId}`,
      "Upload Date": videoDetails.publishedAt.split("T")[0],
    };
    return video;
  });
  try {
    return await Promise.all(final);
  } catch (err) {
    console.log(err);
  }
}

const runYouTubeUpdate = async () => {
  const videoData = await getVideoData();
  await fetchTag.loadAndFetch(2, videoData, "Youtube Videos");
  await uploadFields.uploadToAirtable("Youtube Videos", videoData);
};

runYouTubeUpdate()
module.exports = {
  runYouTubeUpdate,
};

