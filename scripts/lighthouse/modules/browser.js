const puppeteer = require("puppeteer");

export const launchBrowser = async () => {
  const option = { args: ["--no-sandbox", "--disable-setuid-sandbox"] };
  return await puppeteer.launch(option);
};
