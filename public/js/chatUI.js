class ChatUI {
    constructor() {
        this.messagesContainer = document.getElementById('chatMessages');
    }

    addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        if (typeof message === 'string') {
            messageDiv.textContent = message;
        } else if (message instanceof Blob) {
            this.createAudioMessage(messageDiv, message);
        }

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    createAudioMessage(container, audioBlob) {
        const audioDiv = document.createElement('div');
        audioDiv.className = 'audio-message';
        
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.className = 'audio-player';
        audio.src = URL.createObjectURL(audioBlob);
        
        audioDiv.appendChild(audio);
        container.appendChild(audioDiv);
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

const chatUI = new ChatUI();