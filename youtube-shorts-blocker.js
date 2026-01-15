// ==UserScript==
// @name         Youtube shorts blocker
// @namespace    https://github.com/rubenguc/tampermonkey-scripts/blob/main/youtube-shorts-blocker.js
// @version      1.1
// @description  Delete Youtube shorts sections
// @author       rubenguc
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?bb=1&domain=youtube.com
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        /* Ocultar secciones de Shorts por atributos y tags */
        ytd-rich-section-renderer:has([is-shorts]),
        ytd-reel-shelf-renderer,
        ytd-rich-shelf-renderer[is-shorts],
        ytd-reel-video-renderer,

        /* Ocultar videos individuales de shorts */
        ytd-video-renderer:has(a[href^="/shorts/"]),
        ytd-rich-item-renderer:has(a[href^="/shorts/"]),
        ytd-grid-video-renderer:has(a[href^="/shorts/"]),

        /* Ocultar botones en menús */
        ytd-guide-entry-renderer:has(a[title*="Shorts"]),
        ytd-mini-guide-entry-renderer[aria-label*="Shorts"],
        #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[title*="Shorts"] {
            display: none !important;
        }
    `;

    const target = document.head || document.documentElement;
    if (target) {
        target.appendChild(style);
    }

    const removeShortsLogic = (root) => {
        const elements = root.querySelectorAll?.('ytd-rich-section-renderer, ytd-reel-shelf-renderer, ytd-rich-item-renderer');
        if (!elements) return;

        elements.forEach(el => {
            if (el.innerText?.includes("Shorts") || el.querySelector('a[href^="/shorts/"]')) {
                el.style.setProperty('display', 'none', 'important');
            }
        });
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) removeShortsLogic(node);
            });
        }
    });

    const start = () => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
            removeShortsLogic(document.body);
        } else {
            requestAnimationFrame(start);
        }
    };

    start();
})();
