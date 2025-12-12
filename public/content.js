// Content script - extracts text content from the webpage

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        const content = extractPageContent();
        sendResponse({ content });
    }
    return true; // Keep the message channel open for async response
});

// Extract main text content from the page
function extractPageContent() {
    // Remove script and style elements
    const elementsToRemove = document.querySelectorAll('script, style, noscript, iframe, svg, nav, footer, header, aside');

    // Clone the body to avoid modifying the actual page
    const bodyClone = document.body.cloneNode(true);

    // Remove unwanted elements from clone
    bodyClone.querySelectorAll('script, style, noscript, iframe, svg').forEach(el => el.remove());

    // Try to find main content area
    const mainContent = bodyClone.querySelector('main, article, [role="main"], .content, #content, .post, .article');

    let text = '';

    if (mainContent) {
        text = mainContent.innerText;
    } else {
        text = bodyClone.innerText;
    }

    // Clean up the text
    text = text
        .replace(/\s+/g, ' ')           // Replace multiple whitespace with single space
        .replace(/\n\s*\n/g, '\n\n')    // Normalize line breaks
        .trim();

    // Limit text length to avoid API limits (roughly 100k characters)
    const maxLength = 100000;
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...';
    }

    return {
        text: text,
        title: document.title,
        url: window.location.href
    };
}
