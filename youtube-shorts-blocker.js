// ==UserScript==
// @name         Youtube shorts blocker
// @namespace    https://github.com/rubenguc/tampermonkey-scripts/blob/main/youtube-shorts-blocker.js
// @version      1.0
// @description  Delete Youtube shorts sections
// @author       rubenguc
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?bb=1&domain=youtube.com
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  const removeShorts = () => {
    const sections = [
      "grid-shelf-view-model",
      "ytd-rich-section-renderer",
      "ytd-reel-shelf-renderer",
      "ytd-guide-entry-renderer:has(a[title='Shorts'])",
      "ytd-mini-guide-entry-renderer[aria-label='Shorts']",
    ];

    sections.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.innerText.toLowerCase().includes("shorts")) {
          el.remove();
        }
      });
    });

    const shortLinks = document.querySelectorAll("a[href^='/shorts/']");

    shortLinks.forEach((link) => {
      const videoContainer = link.closest(
        "ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer",
      );
      if (videoContainer) {
        videoContainer.remove();
      }
    });
  };

  const observer = new MutationObserver(() => {
    removeShorts();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("load", removeShorts);
  window.addEventListener("yt-navigate-finish", removeShorts);
})();
