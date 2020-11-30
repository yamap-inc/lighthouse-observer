"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.launchBrowser = void 0;

const puppeteer = require("puppeteer");

const launchBrowser = async () => {
  const option = {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  };
  return await puppeteer.launch(option);
};

exports.launchBrowser = launchBrowser;