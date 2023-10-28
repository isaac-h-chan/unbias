function getSelectedText() {
    const selection = window.getSelection();
    return selection.toString();
}

function getAPI(text) {
    const url = 'http://127.0.0.1:8000/analyze';
    fetch (url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error sending text to API: ', error);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        const selectedText = getSelectedText();
        if (selectedText) {
            console.log('hi')
            sendResponse(selectedText);
            console.log('hi2')
            getAPI(selectedText);
        }
        
    }
});