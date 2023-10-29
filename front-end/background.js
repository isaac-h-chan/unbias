chrome.webNavigation.onCompleted.addListener((details) => {
    chrome.scripting.executeScript({
        target: {tabId: details.tabId},
        files: ['front-end/scripts/content.js']
    });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.scripting.executeScript({
        target: {tabId: activeInfo.tabId},
        files: ['front-end/scripts/content.js']
    });
});

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'makeApiCall') {
        const selectedText = message.text;
        
        console.log('right before api call is made')
        
        makeApiRequest(selectedText);
    }
});

function makeApiRequest(text) {
    const apiEndpoint = "http://127.0.0.1:8000/analyze";

    const request = new Request(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: { text: text } // Use JSON.stringify here
    });

    fetch(request)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error making API request:", error);
    });
}