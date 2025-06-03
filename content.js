console.log("Ticker Highlighter content script loaded!");

// Function to find and highlight tickers
function highlightTickers() {
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let currentNode;
    const tickerRegex = /\b[A-Z]{1,5}\b/g; // Regular expression to find potential tickers (1-5 uppercase letters)

    while ((currentNode = textNodes.nextNode())) {
        const text = currentNode.nodeValue;
        let match;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text; // Use innerHTML to parse text and preserve HTML tags if present (though for SHOW_TEXT nodes, usually pure text)

        // Find all matches in the current text node
        while ((match = tickerRegex.exec(text)) !== null) {
            const ticker = match[0];
            // For now, we'll just log it to the console
            console.log("Found potential ticker:", ticker);

            // In future steps, we will add logic here to fetch color and apply styling.
            // For a basic demonstration, let's just wrap it in a span for now to show we found it
            // NOTE: Directly modifying nodeValue with HTML will escape the HTML.
            // A more robust solution for highlighting involves replacing the text node
            // with multiple nodes (text + styled span + text). For simplicity here,
            // we're just logging. Actual highlighting will be done in a later step.

            // Send a message to the background script to fetch the color
            chrome.runtime.sendMessage({ action: "fetchTickerColor", ticker: ticker }, (response) => {
                if (response && response.color) {
                    console.log(`Received color for ${ticker}: ${response.color}`);
                    // In a later step, we'll apply this color to the ticker on the page.
                    // For now, just logging to see the communication works.
                } else if (response && response.error) {
                    console.error(`Error fetching color for ${ticker}: ${response.error}`);
                }
            });
        }
    }
}

// Run the function when the page loads
// We might want to make this run after the DOM is fully loaded in a more robust way later.
highlightTickers();