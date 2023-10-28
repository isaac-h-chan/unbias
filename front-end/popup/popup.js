chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    chrome.storage.local.get(currentTabId.toString(), (result) => {
        const count = result[currentTabId];
        if (typeof count !== 'undefined') {
            document.getElementById('count').textContent = `Number of <p> tags: ${count}`;
        } else {
            document.getElementById('count').textContent = 'Unable to fetch <p> tag count.';
        }
    });
});