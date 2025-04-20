// Chatbot implementation
const API_KEY = 'AIzaSyDDB8SvUw7Y9cPBnci7qbp5qMh0vEGhO2M';
const CHAT_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

class Chatbot {
    constructor() {
        this.messages = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const chatToggle = document.getElementById('chatbot-toggle');
        const closeChat = document.getElementById('close-chat');

        sendButton.addEventListener('click', () => this.handleUserMessage(chatInput.value));
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage(chatInput.value);
            }
        });

        chatToggle.addEventListener('click', () => this.toggleChat());
        closeChat.addEventListener('click', () => this.toggleChat());
    }

    async handleUserMessage(message) {
        if (!message.trim()) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        document.getElementById('chat-input').value = '';

        try {
            const response = await this.getAIResponse(message);
            const cleanedResponse = this.cleanResponseText(response);
            this.addMessage(cleanedResponse, 'assistant');
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
    }

    cleanResponseText(text) {
        // Remove markdown formatting
        return text
            .replace(/\*\*/g, '') // Remove bold
            .replace(/\*/g, '')   // Remove italics
            .replace(/_/g, '')    // Remove underscores
            .replace(/`/g, '')    // Remove code blocks
            .replace(/#/g, '')    // Remove headers
            .replace(/>/g, '')    // Remove blockquotes
            .replace(/-/g, '')    // Remove list items
            .trim();              // Remove extra whitespace
    }

    async getAIResponse(message) {
        try {
            const response = await fetch(CHAT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: message
                        }]
                    }]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
                console.error('Invalid response format:', data);
                throw new Error('Invalid response format from API');
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error in getAIResponse:', error);
            throw error;
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    toggleChat() {
        const chatContainer = document.getElementById('chat-container');
        chatContainer.classList.toggle('active');
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
}); 