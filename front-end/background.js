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

let popupSender = null;
// makes api call
chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (message.action === 'makeApiCall') {
        const selectedText = message.text;
        popupSender = sender;
        try {
            let data = await getScores(selectedText);
            
            chrome.runtime.sendMessage(popupSender.id, {
                action: 'apiResponse', 
                data: data
            });

            // log data for testing
            // console.log('text complexity: ' + data.complexity);
            // console.log('text length: ' + data.length);
            // for (let i = 0; i < data.sents.length; i++) {
            //     console.log('Sentence:', data.sents[i]);
            //     console.log('Sentiment Score:', data.sentiment[i].compound);
            // }
            // console.log(data);
        } catch (error) {
            console.error("Error processing data: ", error);
        }
    }
});

async function getScores(text) {
    const url = "http://127.0.0.1:8000/analyze";
    const request = new Request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text }) // Use JSON.stringify here
    });

    try {
        const response = await fetch(request);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error making API request:", error);
    }
}
