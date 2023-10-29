// receives data from background.js if api call is made
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'apiResponse') {
        const data = message.data;
        const sentences = data.sents;
        const scores = data.sentiment;

        const complexity = data.complexity.toFixed(2);
        const avgLen = data.length;
        const fleschScore = 206.835 - (1.015 * avgLen) - (84.6 * complexity);

        document.getElementById('complexity').textContent = 'Clarity index: ' + fleschScore;

        const sentsList = document.getElementById('sentences');
        for (i = 0; i < sentences.length; ++i) {
            let li = document.createElement('li')
            li.innerText = sentences[i] + " -- " + scores[i].neg;
            sentsList.appendChild(li);
        }
    }
})

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab.url?.startsWith("chrome://")) {
        document.getElementById('selectedText').textContent = "Does not work in chrome:// websites";
        return undefined;
    }

    // Request the selected text from the content script
    chrome.tabs.sendMessage(currentTab.id, { action: 'getSelectedText' }, (response) => {
        if (response && response.text) {
            document.getElementById('selectedText').textContent = "Scores of the Selected Text";
            // Notify background script to make the API call
            chrome.runtime.sendMessage({ action: 'makeApiCall', text: response.text });
        } else {
            document.getElementById('selectedText').textContent = 'No text selected.';
        }
    });
});