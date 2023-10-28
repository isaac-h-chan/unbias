chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.scripting.executeScript({
        target: { tabId: currentTab.id },
        function: getSelectedTextFromPage,
    })
    .then((injectionResults) => {
        for (const result of injectionResults) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            const selectedText = result.result;
            if (selectedText) {
                document.getElementById('selectedText').textContent = selectedText;
            } else {
                document.getElementById('selectedText').textContent = 'No text selected.';
            }
        }
    })
    .catch((error) => {
        console.error(error);
        document.getElementById('selectedText').textContent = 'An error occurred.';
    })
});

function getSelectedTextFromPage() {
    const selection = window.getSelection();
    return selection.toString();
}
