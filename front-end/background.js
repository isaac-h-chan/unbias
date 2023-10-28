chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.scripting.executeScript({
        target: {tabId: details.tabId},
        files: ['scripts/content.js']
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "pTagCount") {
        const tabId = sender.tab.id;
        chrome.storage.local.set({ [tabId]: message.count });
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.scripting.executeScript({
        target: {tabId: activeInfo.tabId},
        files: ['scripts/content.js']
    });
});