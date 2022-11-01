# cataloging ODI Outputs

![sources](./odi-sources.svg)

# The aim

The ODI needs a way to catalog its outputs. This is a tool that will allow us to:

- Add new outputs
- Edit existing outputs
- Delete outputs
- Search for outputs
- Filter outputs by:
  - Type
  - Theme
  - Event / Series
  - Year
  - Author
  - Tags (supported by [PermId](https://permid.org/onecalaisViewer))

Doing so will allow us to have a full comprehension of our outputs, allowing us to avoid duplication, understand gaps in our knowledge and find areas of knowledge we appear to be strong in.

# Step one: identifying the sources

All the ODI's outputs do not exist solely on one platform.

The first step was to identify the sources of our outputs. We have a number of sources:

- YouTube
- Vimeo
- SoundCloud
- The Week in Data
- The ODI website:
  - Blog
  - Articles
  - Explainers
  - Reports
  - News

# Step two: scraping and organising the data

There are many programmatic functionalities which are required to ensure the data is fit for upload into the database:

## 1. Cron

- This application will capture all scrapers, cleaners and taggers, executing every 7 days.
- One caveat to this scheduling application is that it must ensure that it does not duplicate or overwrite old data. To ensure this, the scheduler must only scrape the data from the past 7 days of upload.

**Developers building steps**

1. Use a library which runs a function when given date.
2. Find the current date.
3. Find the date when it was last scraped
4. Set a state which will trigger the execution
5. Minus the current date from the previous scrape date
6. Scrape the new data by calling the node schedule library. Use the new scrape date as the end date and the previous scrape date as the start date.
7. We will now create our other applications with the exporting in mind so that we can wrap our scheduled execution app around them.

## 2. Website scraper

- The scraper needs to account for all the different URLs. Different URLs with different website layouts require different methods of extraction. Consequently, numerous different scrapers with different functions will need to be built. A YouTube video will need an entirely different scraper to the ODI article's scraper, and a Vimeo video will need an entirely different scraper to the SoundCloud scraper, and so on.
- This program will run a scraper using the help of the `nodejs-web-scraper library`. It will search for the title, date, link, description, synopsis, categories, story, author, date in the Knowledge and Opinion section of the website.
- When it has scraped the data, it will write the data to a JSON file. The data will be cleaned so that it is properly formatted for upload to the database.
- **Side note:** the Week in Data cannot be scraped because there is no public facing URL. I will use a different method of downloading all the ones from the drive as a zip and then building a customised Word document scraper which gets all the important information from each Week in Data document.
- **Side note 2:** The ODI's Toolkits are spread across multiple URLs as there is no plausible way of automating the scraping process.

**Developers building steps**

1. Scrape the ODI website.
2. Find a scraping library tool.
3. Make sure to scrape the date, link, description, synopsis, categories, story, author and the data
4. Clean the data so that it is properly formatted for upload to the database.
5. Write the data to a JSON file.
6. Repeat this process for all the other sources.


# Hosting and syncing the database

Currently we are using Airtable as a place to store and visualise the catalogue. After the data has been properly organised, the data will be pushed to the table platform every seven days. This will allow us to have a live catalogue of all our outputs. The data will be pushed to the table platform using the Airtable API. 

As a side-project, found in 

# File explanation

## Airtable connectors

- `add-new-fields-airtable`: uploads data to Airtable. Using the basename and the data, it creates a new table with a new record in the table.
- `add-odi-article-fields-airtable`: uploads the ODI article data to airtable the structure of the data is different from the other data at the moment. It includes the title, synopsis, categories, author, date, story, document url, type and address looping through the cleaned data, creating a new record in the airtable table with the data.
- `attach-tags-airtable`: attaches tha Open Calais PermID intelligent tags to the airtable records the tags return a set of objects with index as its key and the tags as its value in an array the the first function converts the object to an array, removing the keys and then flattens the array to a single array of tags the second function then attaches the tags to the airtable records.

## Cron

- `cron`: this is the main application which runs all the other applications. It runs every 7 days and ensures that the data is not duplicated or overwritten. It also ensures that the data is properly formatted for upload to the database.

## Scrapers

- `odi-website`: This file scrapes the ODI article data from the ODI website. It returns the title, synopsis, categories, author, date, story, document url, type and address
- `soundcloud-podcasts`: This scrapes the ODI SoundCloud data by the running a bot that can scroll page, finding every URL and then running the URL into the SoundCloud scraper API. It picks up the title, event/series, description, thumbnail, URL, duration,play count, likes, upload, tags, type.
- `youtube-videos`:  this file uses the google api to get data from youtube and upload it to airtable. it takes in the channel id and the number of videos to scrape from the channel. gets the video id of every video in the channel and then gets the details of every video in the channel. gets the tags of every video in the channel. gets the type of every video in the channel. gets the stats of every video in the channel. uploads the data to airtable, returning a promise that resolves when the data is uploaded to airtable.

## Tagger
- `smart-tagger`: This file uses a specific field in a JSON array and tags it using the PERMid open calais API. it takes in the number of records to tag, the array to tag, and the name of the base to tag. it returns a promise that resolves when the data is uploaded to airtable.

## Link checker
- `link-checker`: This file grabs the links on airtable relating to youtube, vimeo, SoundCloud, and all ODI.org links found in the knowledge and opinion section. it uses either the websites relevant API or reads the html page checking if the page returns a generic error.

## Cleaner
- `cleaner`: This file takes the scraped ODI data and formats it to be uploaded to airtable without any errors and un.  characters.
