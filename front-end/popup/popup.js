chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab.url?.startsWith("chrome://")) {
        document.getElementById('selectedText').textContent = "Does not work in chrome:// websites";
        return undefined;
    }

    // Request the selected text from the content script
    chrome.tabs.sendMessage(currentTab.id, { action: 'getSelectedText' }, (response) => {
        if (response && response.text) {
            console.log('popup clicked');
            document.getElementById('selectedText').textContent = response.text;
            // Notify background script to make the API call
            chrome.runtime.sendMessage({ action: 'makeApiCall', text: response.text });
        } else {
            document.getElementById('selectedText').textContent = 'No text selected.';
        }
    });
});