// receives data from background.js if api call is made
chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action !== 'apiResponse') {
        return;
    }
    const data = message.data;
    const sentences = data.sents;
    const scores = data.sentiment;

    const grade = grades[Math.min(Math.floor((0.39 * data.length) + 11.8 * data.complexity - 15.59), 18)];
    document.getElementById('complexity').textContent = 'Comprehension Level: ' + grade;
    
    document.getElementById('body').style.width = '400px';

    const container = document.getElementById('container');
    // hides comprehension level and line breaks when no text selected
    const hiddenContent = document.getElementById('hidden');
    hiddenContent.removeAttribute('hidden');
    // injects tone scores list
    const sent_list = document.createElement('ul');
    sent_list.innerText = 'Tone Scores';
    sent_list.setAttribute('id', 'sentences');
    container.appendChild(sent_list);
    // injects sentence into tone scores list
    const sentsList = document.getElementById('sentences');

    for (i = 0; i < sentences.length; ++i) {
        let li = document.createElement('li');
        li.classList.add('element')

        let sent = document.createElement('div');
        sent.classList.add('sent')
        sent.innerText = sentences[i]

        let score = document.createElement('div');
        score.classList.add('score')
        score.innerText = scores[i].compound.toFixed(2);

        li.appendChild(sent);
        li.appendChild(score);
        sentsList.appendChild(li);

        const text = sent.innerText;
        
        li.addEventListener('click', () => {
            const text = sent.innerText; // Adjusted this line to get the innerText within the event listener's scope
            const sentenceRequest = new Request("http://127.0.0.1:8000/neutral", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            // generate new sentence
            let newSentence;
            generate(sentenceRequest)
                .then(newSent => {
                    newSentence = newSent.text;
                    sent.innerText = newSentence;
                    // Now use the newSent to make the second request
                    return generate(new Request("http://127.0.0.1:8000/analyze", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ text: newSentence })
                    }));
                })
                .then(newScore => {
                    score.innerText = newScore.sentiment[0].compound;
                })
                .catch(error => {
                    console.error("Error in generate function:", error);
            });
            console.log('sentence clicked!');
        });
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
            document.getElementById('selectedText').textContent = 'Select text to begin!';
        }
    });
});

grades = {
    0: 'Kindergarten',
    1: 'First Grade',
    2: 'Second Grade',
    3: 'Third Grade',
    4: 'Fourth Grade',
    5: 'Fifth Grade',
    6: '6th to 7th Grade',
    7: '6th to 7th Grade',
    8: '8th to 9th Grade',
    9: '8th to 9th Grade',
    10: '10th to 12th Grade',
    11: '10th to 12th Grade',
    12: '10th to 12th Grade',
    13: 'College Level',
    14: 'College Level',
    15: 'College Level',
    16: 'College Level',
    17: 'Graduate Level',
    18: 'Graduate Level'
}

const generate = (request) => {
    return fetch(request)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Response error');
            }
            return response.json();
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
}

