const AudioUtils = require('../utils/audio.utils');

class AudioService {
    constructor() {
        this.audioBuffers = new Map(); // clientId -> array of audio buffers
    }

    addAudioChunk(clientId, audioBase64) {
        if (!this.audioBuffers.has(clientId)) {
            this.audioBuffers.set(clientId, []);
        }

        const audioBuffer = AudioUtils.base64ToBuffer(audioBase64);
        this.audioBuffers.get(clientId).push(audioBuffer);
    }

    async getFinalAudio(clientId) {
        const buffers = this.audioBuffers.get(clientId) || [];
        const concatenatedBuffer = await AudioUtils.concatenateAudioBuffers(buffers);

        // Clear the buffers for this client
        this.audioBuffers.delete(clientId);

        return concatenatedBuffer;
    }

    clearAudioBuffers(clientId) {
        this.audioBuffers.delete(clientId);
    }
}

module.exports = new AudioService();