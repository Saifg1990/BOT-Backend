class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.start();
            return true;
        } catch (error) {
            console.error('Error starting recording:', error);
            return false;
        }
    }

    stopRecording() {
        return new Promise((resolve) => {
            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
                resolve(audioBlob);
            };
            this.mediaRecorder.stop();
        });
    }
}

const audioRecorder = new AudioRecorder();