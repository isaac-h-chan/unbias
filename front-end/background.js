chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.scripting.executeScript({
        target: {tabId: details.tabId},
        files: ['scripts/content.js']
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "highlighted") {
        const tabId = sender.tab.id;
        chrome.storage.local.set({ [tabId]: message.text });
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.scripting.executeScript({
        target: {tabId: activeInfo.tabId},
        files: ['scripts/content.js']
    });
});