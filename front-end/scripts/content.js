const pTagCount = document.querySelectorAll('p').length;
chrome.runtime.sendMessage({ type: "pTagCount", count: pTagCount });