function getSelectedText() {
    const selection = window.getSelection();
    return selection.toString();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSelectedText') {
        const selectedText = getSelectedText();
        if (selectedText) {
            sendResponse({ action: 'selectedText', text: selectedText });
        } else {
            sendResponse({ action: 'selectedText', text: null });
        }
    }
});