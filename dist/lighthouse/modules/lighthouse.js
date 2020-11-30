"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatLighthouseResult = exports.runLighthouse = void 0;

var _constants = require("./constants");

var _date = require("./date");

const lighthouse = require("lighthouse");

const runLighthouse = async (browser, url) => {
  return await lighthouse(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: ["json"],
    logLevel: "info"
  });
};

exports.runLighthouse = runLighthouse;

const formatLighthouseResult = (lighthouseResults, timezone) => {
  const result = _constants.lighthouseDBColumnNames.map(columnName => {
    const key = columnName.replace(/_/gi, "-");

    switch (columnName) {
      case "fetch_time":
        return (0, _date.formatDatetime)(lighthouseResults.fetchTime, timezone);

      case "requested_url":
        return lighthouseResults.requestedUrl;

      case "performance":
      case "accessibility":
      case "best_practices":
      case "seo":
      case "pwa":
        return lighthouseResults.categories[key].score || null;

      default:
        return lighthouseResults.audits[key].numericValue || null;
    }
  });

  return result;
};

exports.formatLighthouseResult = formatLighthouseResult;