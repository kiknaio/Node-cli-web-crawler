// To parse url
const URL = require('url-parse');
// To parse HTML
const cheerio = require('cheerio');
// For HTTP requests
const request = require('request');
// Terminal colors
const colors = require('colors');

// Website for crawling
const website = 'http://www.gentics.com/';

// Info about website
console.log('Visiting ' + website);

// Website request
request(website, function(err, res, body) {
  if (err) {
    console.error('Error: ' + err);
  } else if (res.statusCode === 200) {
    // Assign whole page to variable
    var site = cheerio.load(body);
    console.log("Page title " + site('title').text());


    // Link Searcher
    function search() {
      var internal = [];
      var external = [];

      // Search for internal links
      var internalLinks = site("a[href^='/']");
      internalLinks.each(function() {
        internal.push(site(this).attr('href'));
      });

      // Search for external links
      var externalLinks = site("a[href^='http']");
      externalLinks.each(function() {
        external.push(site(this).attr('href'));
      });

      // total links
      console.log('Total links: ' + Number(internal.length + external.length));
      // Internal
      console.log('Internal links: ' + internal.length);
      // External
      console.log('External: ' + external.length);
      
      // All internal links
      console.log('Internal Links'.blue)
      internal.forEach(function(link) {
        console.log(link.green);
      });
      // All external links
      console.log('External Links'.blue);
      external.forEach(function(link) {
        console.log(link.red);
      });
    }

    search();
  }

});