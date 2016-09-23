'use strict';

if (!process.env.WORDNIK_TOKEN || !process.env.SLACK_WEBHOOK) {
  console.log('No tokens configured.');
  process.exit();
}

// core modules
const os = require('os');
const url = require('url');

// package modules
const request = require('request');

/**
 * Return a date in the YYYY-MM-DD format
 * @return {String} The formatted date
 */
const getDate = () => {
  const date = new Date();
  const fullYear = date.getFullYear();
  const day = date.getDate();

  let month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }

  return [
    fullYear,
    month,
    day
  ].join('-');
};

/**
 * Make a server side request
 * @param  {String}   url  The URL
 * @param  {Object}   data The data object if the request is POST
 * @param  {Function} cb   The callback
 */
const makeRequest = (url, data, cb) => {
  const requestObj = {
    url: url
  };
  let method = 'get';

  if (data) {
    method = 'post';
    requestObj.form = data;
  }

  request[method](requestObj, cb);
};

/**
 * Format strings Slack style
 * @type {Object}
 */
const f = {
  bold(str) {
    return '*' + str + '*';
  },
  underline(str) {
    return '_' + str + '_';
  },
  blockquote(str) {
    return '> ' + str;
  }
};

/**
 * Format the Slack response
 * @param  {Object} wodObj The Word of the Day object
 */
const formatSlackResponse = wodObj => {
  const slackResponse = {
    username: 'Word of the Day',
    icon_emoji: ':doge2:',
    channel: slackChannel,
    text: f.bold(wodObj.word) + os.EOL + f.blockquote(wodObj.note),
    attachments: [
      formatDefinitions(wodObj.definitions),
      formatExamples(wodObj.examples)
    ]
  };

  makeRequest(slackWebhook, {
    payload: JSON.stringify(slackResponse)
  }, () => { /* noop */ });
};

/**
 * Format the examples
 * @param  {Array} examplesArr  The examples array
 * @return {Object}             The examples object
 */
const formatExamples = examplesArr => {
  const examples = {
    title: 'Examples',
    color: '#63b76c',
    fields: []
  };

  examplesArr.forEach(example => {
    examples.fields.push({
      title: example.title,
      value: example.text,
      short: false
    });
  });

  return examples;
};

/**
 * Format teh definitons
 * @param  {Array} definitionArr  The definitions array
 * @return {Object}               The definitions object
 */
const formatDefinitions = definitionArr => {
  const definitions = {
    title: 'Definitions',
    color: '#99d04a',
    fields: []
  }

  definitionArr.forEach(definition => {
    definitions.fields.push({
      title: definition.source,
      value: definition.text,
      short: false
    });
  });

  return definitions;
};

/**
 * Word of the Day API token
 * @type {String}
 */
const wodToken = process.env.WORDNIK_TOKEN;

/**
 * Word of the Day formatted API URL
 * @type {String}
 */
const wodAPIUrl = url.format({
  protocol: 'https',
  host: 'api.wordnik.com',
  pathname: 'v4/words.json/wordOfTheDay',
  query: {
    date: getDate(),
    api_key: wodToken
  }
});

/**
 * The Slack Webhook URL
 * @type {String}
 */
const slackWebhook = process.env.SLACK_WEBHOOK;

/**
 * The Slack channel to post to
 * @type {String}
 */
const slackChannel = process.env.SLACK_CHANNEL || '#general';


// init
makeRequest(wodAPIUrl, null, (e, r, b) => {
  if (e) {
    console.log(e);
    process.exit();
  }

  const body = JSON.parse(b);
  formatSlackResponse(body);
});
