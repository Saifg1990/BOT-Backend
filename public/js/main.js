document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const recordButton = document.getElementById('recordButton');
    const recordingStatus = document.getElementById('recordingStatus');
    
    let isRecording = false;

    // Text message handling
    async function sendTextMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        chatUI.addMessage(message, true);
        messageInput.value = '';

        try {
            const response = await fetch('/api/chat/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

            const reader = response.body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const text = new TextDecoder().decode(value);
                const lines = text.split('\n');
                
                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.type === 'error') {
                                console.error('Server error:', data.content);
                                chatUI.addMessage('An error occurred. Please try again.', false);
                            } else {
                                handleResponse(data);
                            }
                        } catch (error) {
                            console.error('Error parsing SSE data:', error);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            chatUI.addMessage('Failed to send message. Please try again.', false);
        }
    }

    // Audio recording handling
    async function toggleRecording() {
        if (!isRecording) {
            const started = await audioRecorder.startRecording();
            if (started) {
                isRecording = true;
                recordButton.classList.add('recording');
                recordButton.textContent = 'Stop Recording';
                recordingStatus.textContent = 'Recording...';
            }
        } else {
            const audioBlob = await audioRecorder.stopRecording();
            isRecording = false;
            recordButton.classList.remove('recording');
            recordButton.textContent = 'Record';
            recordingStatus.textContent = '';

            chatUI.addMessage(audioBlob, true);
            await sendAudioMessage(audioBlob);
        }
    }

    async function sendAudioMessage(audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        try {
            const response = await fetch('/api/chat/audio', {
                method: 'POST',
                headers: {
                    'Accept': 'text/event-stream'
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send audio');
            }

            const reader = response.body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const text = new TextDecoder().decode(value);
                const lines = text.split('\n');
                
                lines.forEach(line => {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.type === 'error') {
                                console.error('Server error:', data.content);
                                chatUI.addMessage('An error occurred. Please try again.', false);
                            } else {
                                handleResponse(data);
                            }
                        } catch (error) {
                            console.error('Error parsing SSE data:', error);
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error sending audio:', error);
            chatUI.addMessage('Failed to send audio. Please try again.', false);
        }
    }

    function handleResponse(data) {
        if (data.type === 'text') {
            chatUI.addMessage(data.content);
        } else if (data.type === 'audio') {
            const audioBlob = base64ToBlob(data.content, 'audio/wav');
            chatUI.addMessage(audioBlob);
        } else if (data.type === 'full_audio') {
            const audioBlob = base64ToBlob(data.content, 'audio/wav');
            chatUI.addMessage(audioBlob);
        }
    }

    function base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new Blob(byteArrays, { type: mimeType });
    }

    // Event listeners
    sendButton.addEventListener('click', sendTextMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendTextMessage();
    });
    recordButton.addEventListener('click', toggleRecording);

    // WebSocket message handling
    wsClient.addMessageHandler((data) => {
        handleResponse(data);
    });
});