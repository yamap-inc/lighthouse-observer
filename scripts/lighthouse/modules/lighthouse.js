import { lighthouseDBColumnNames } from "./constants";
import { formatDatetime } from "./date";
const lighthouse = require("lighthouse");

export const runLighthouse = async (browser, url) => {
  return await lighthouse(url, {
    port: new URL(browser.wsEndpoint()).port,
    output: ["json"],
    logLevel: "info",
    "form-factor": "mobile",
    screenEmulation: {
      width: 360,
      height: 640,
      mobile: true,
      deviceScaleFactor: 2,
    }
  });
};

export const formatLighthouseResult = (lighthouseResults, timezone) => {
  const result = lighthouseDBColumnNames.map((columnName) => {
    const key = columnName.replace(/_/gi, "-");
    switch (columnName) {
      case "fetch_time":
        return formatDatetime(lighthouseResults.fetchTime, timezone);
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
