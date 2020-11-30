import { launchBrowser } from "./modules/browser";
import { runLighthouse, formatLighthouseResult } from "./modules/lighthouse";
import { appendSpreadSheet, getGoogleClientAuth } from "./modules/spreadsheet";

/**
 * Triggered from a message on a Cloud Pub/Sub topic.
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const main = async (event, _context) => {
  const bufferString = Buffer.from(event.data, "base64").toString();
  const config = JSON.parse(bufferString);
  
  const browser = await launchBrowser();
  const auth = await getGoogleClientAuth();

  for (let target of config.targets) {
    console.log("[start]", target.url);
    const { lhr } = await runLighthouse(browser, target.url);
    const result = formatLighthouseResult(lhr, config.timezone);
    await appendSpreadSheet(auth, config.spreadsheetId, target.sheetName, [
      result,
    ]);
  }

  if (browser) await browser.close();
};

exports.runLighthouseObserver = main;
