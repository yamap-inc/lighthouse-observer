"use strict";

var _browser = require("./modules/browser");

var _lighthouse = require("./modules/lighthouse");

var _spreadsheet = require("./modules/spreadsheet");

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const main = async (event, _context) => {
  const bufferString = Buffer.from(event.data, "base64").toString();
  const config = JSON.parse(bufferString);
  const browser = await (0, _browser.launchBrowser)();
  const auth = await (0, _spreadsheet.getGoogleClientAuth)();

  for (let target of config.targets) {
    console.log("[start]", target.url);
    const {
      lhr
    } = await (0, _lighthouse.runLighthouse)(browser, target.url);
    const result = (0, _lighthouse.formatLighthouseResult)(lhr, config.timezone);
    await (0, _spreadsheet.appendSpreadSheet)(auth, config.spreadsheetId, target.sheetName, [result]);
  }

  if (browser) await browser.close();
};

exports.runLighthouseObserver = main;