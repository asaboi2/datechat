// Constants
const SERVERLESS_FUNCTION_ENDPOINT = '/.netlify/functions/claude-proxy';

// DOM Elements
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// State
let isWaitingForResponse = false;
let conversationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners
    userInput.addEventListener('keydown', handleInputKeydown);
    sendButton.addEventListener('click', handleSendMessage);
    
    // Auto-resize textarea
    userInput.addEventListener('input', autoResizeTextarea);
});

function autoResizeTextarea() {
    userInput.style.height = 'auto';
    userInput.style.height = (userInput.scrollHeight) + 'px';
    
    // Reset to default height if empty
    if (userInput.value === '') {
        userInput.style.height = '';
    }
}

function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

function handleSendMessage() {
    const message = userInput.value.trim();
    if (message && !isWaitingForResponse) {
        // Add user message to UI
        addMessageToUI('user', message);
        
        // Clear input
        userInput.value = '';
        userInput.style.height = '';
        
        // Add to conversation history
        conversationHistory.push({
            role: 'user',
            content: message
        });
        
        // Show typing indicator
        showTypingIndicator();
        
        // Set waiting state
        isWaitingForResponse = true;
        toggleInputState(true);
        
        // Send to API
        sendMessageToAPI(message);
    }
}

function addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Process markdown-like content (simple version)
    const formattedContent = formatMessage(content);
    contentDiv.innerHTML = formattedContent;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    scrollToBottom();
}

function formatMessage(content) {
    // This is a simple formatter - in a production app, you'd use a proper markdown parser
    let formatted = content
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br>');
    
    return formatted;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typing-indicator';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'typing-indicator';
    typingContent.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(typingContent);
    messagesContainer.appendChild(typingDiv);
    
    scrollToBottom();
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function toggleInputState(disabled) {
    userInput.disabled = disabled;
    sendButton.disabled = disabled;
}

function showErrorMessage(message) {
    removeTypingIndicator();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    messagesContainer.appendChild(errorDiv);
    
    scrollToBottom();
    isWaitingForResponse = false;
    toggleInputState(false);
}

async function sendMessageToAPI(message) {
    try {
        console.log('Sending message to serverless function:', SERVERLESS_FUNCTION_ENDPOINT);
        
        // Call our serverless function instead of Claude API directly
        const response = await fetch(SERVERLESS_FUNCTION_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });
        
        // Check if response is OK
        if (!response.ok) {
            // Try to get error message from response
            let errorMessage;
            try {
                // Try to parse as JSON first
                const errorData = await response.json();
                errorMessage = errorData.error || `Server error: ${response.status}`;
            } catch (parseError) {
                // If not JSON, get text content
                try {
                    const errorText = await response.text();
                    // If it's HTML, provide a more helpful message
                    if (errorText.includes('<!DOCTYPE html>')) {
                        errorMessage = `Server returned HTML instead of JSON. Status: ${response.status}. This usually means the serverless function is not found or has an error.`;
                    } else {
                        errorMessage = `Server error: ${response.status}. Response: ${errorText.substring(0, 100)}...`;
                    }
                } catch (textError) {
                    errorMessage = `Server error: ${response.status}. Could not read response.`;
                }
            }
            throw new Error(errorMessage);
        }
        
        // Parse successful response
        const data = await response.json();
        handleAPIResponse(data);
    } catch (error) {
        console.error('API Error:', error);
        showErrorMessage(`Error: ${error.message || 'Failed to communicate with Claude API'}`);
    }
}

function handleAPIResponse(data) {
    removeTypingIndicator();
    
    if (data.content && data.content.length > 0) {
        const assistantMessage = data.content[0].text;
        
        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });
        
        // Add to UI
        addMessageToUI('assistant', assistantMessage);
    } else {
        showErrorMessage('Received an empty response from Claude');
    }
    
    // Reset state
    isWaitingForResponse = false;
    toggleInputState(false);
}

// Helper function to clear conversation
function clearConversation() {
    conversationHistory = [];
    
    // Keep only the first welcome message
    while (messagesContainer.children.length > 1) {
        messagesContainer.removeChild(messagesContainer.lastChild);
    }
}

// Helper function to remove API key
function removeApiKey() {
    apiKey = '';
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    showApiKeyModal();
}
