// To parse url
const URL = require('url-parse');
// To parse HTML
const cheerio = require('cheerio');
// For HTTP requests
const request = require('request');
// Terminal colors
const colors = require('colors');

// Website for crawling
const website = 'http://www.gentics.com/genticscms/';

// Info about website
console.log('Visiting ' + website);

var alreadyCrawledList = [];

var WebCrawler = function(website) {
  this.website = website;
  this.data = {
    title: '',
    links: {
      total: 0,
      internal: [],
      external: []
    }
  };
};

// Status code and error checker
WebCrawler.prototype.crawl = function() {
  var self = this;
  var callback = function(err, res, body) {
    if (err || res.statusCode !== 200) {
      //console.error('Error: ' + (err || 'Oops, something went wrong.'));
      return;
    }

    // Get and save the page title
    var site = cheerio.load(body);
    self.data.title = site('title').text();

    // Get total links
    var totalLinks = site('a[href]');
    totalLinks.each(function(index, link) {
      // Get href
      var href = site(link).attr('href');

      // Increment the count of links
      self.data.links.total++;

      // Check if it is external or internal
      if (href.match(/https?/g)) {
        self.data.links.external.push(href);
      } else {
        self.data.links.internal.push(href);
      }
    });

    // Filter down and remove the hash links and
    // also, remove the forward slash from
    // the beginning, if there is any
    self.data.links.internal = self.data.links.internal.filter(function(link) {
      return link.indexOf('#') !== 0;
    }).map(function(link) {
      if (link.indexOf('/') === 0) link = link.substring(1);
      return link;
    });

    //console.log('Total links on ' + self.website + ': ' + self.data.links.total);

    // Loop over the internal links
    for (var i = 0, l = self.data.links.internal.length; i < l; i++) {
      // Generate the link
      var toCrawl = website + self.data.links.internal[i];

      // If we haven't crawled this link already
      if (alreadyCrawledList.indexOf(toCrawl) < 0) {
       // console.log('Starting to crawl: ' + toCrawl);
        alreadyCrawledList.push(toCrawl);
        var crawler = new WebCrawler(website + self.data.links.internal[i]);
        crawler.crawl();
      }
      // Output the links
      console.log(self.data.links.internal[i]);
    }
    
  };
  request(this.website, callback);
};

var crawler = new WebCrawler(website + 'index.de.html');
crawler.crawl();