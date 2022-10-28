// IMPORTANT: This is a workaround for the issue with the pagination scraping found in the node-js-web-scraper package. Replace the pagination.js file in the node_modules/nodejs-web-scraper/utils folder with this code.


/**
     * 
     * @param {string} address 
     * @param {Object} config
     * @return {string[]}
     */
 function getPaginationUrls(address, { numPages, begin, end, offset = 1, queryString, routingString }) {
    // const numPages = pagination.numPages;
    const firstPage = typeof begin !== 'undefined' ? begin : 1;
    const lastPage = end || numPages;
    // const offset = offset || 1;
    const paginationUrls = []
    for (let i = firstPage; i <= lastPage; i = i + offset) {

        const mark = address.includes('?') ? '&' : '?';
        var paginationUrl;

        if (queryString) {
            paginationUrl = `${address}${queryString}/${i}`;
        } else {
            paginationUrl = `${address}/${routingString}/${i}`.replace(/([^:]\/)\/+/g, "$1");
        }
        paginationUrls.push(paginationUrl)
    }
    return paginationUrls;
}

module.exports = {
    getPaginationUrls
}