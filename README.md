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

## 3. Syncing to a platform

Currently we are using Airtable as a place to store and visualise the catalogue. After the data has been properly organised, the data will be pushed to the table platform every seven days.
