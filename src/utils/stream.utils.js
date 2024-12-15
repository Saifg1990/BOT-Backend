const AudioService = require('../services/audio.service');

class StreamHandler {
  constructor(res, clientId, broadcastMessage) {
    this.res = res;
    this.clientId = clientId;
    this.broadcastMessage = broadcastMessage;
    this.buffer = '';
    this.isComplete = false;
  }

  setupSSEHeaders() {
    this.res.setHeader('Content-Type', 'text/event-stream');
    this.res.setHeader('Cache-Control', 'no-cache');
    this.res.setHeader('Connection', 'keep-alive');
  }

  handleChunk(chunk) {
    try {
      this.buffer += chunk.toString();
      const lines = this.buffer.split('\n');
      this.buffer = lines.pop();

      lines.forEach(line => this.processLine(line));
    } catch (error) {
      console.error('Error processing chunk:', error);
    }
  }

  async processLine(line) {
    if (!line.trim()) return;

    try {
      const data = JSON.parse(line);

      if (data.type === 'text') {
        this.broadcastMessage(this.clientId, data);
        this.res.write(`data: ${JSON.stringify(data)}\n\n`);
      } else if (data.type === 'audio') {
        // Store audio chunk instead of sending immediately
        AudioService.addAudioChunk(this.clientId, data.content);
      } else if (data.type === 'complete') {
        this.isComplete = true;
        // Get final concatenated audio
        const audioBuffer = await AudioService.getFinalAudio(this.clientId);
        const finalAudioData = {
          type: 'audio',
          content: audioBuffer.toString('base64')
        };

        this.broadcastMessage(this.clientId, finalAudioData);
        this.res.write(`data: ${JSON.stringify(finalAudioData)}\n\n`);
      }
    } catch (error) {
      console.error('Error parsing line:', error);
    }
  }

  handleError(error) {
    console.error('Stream error:', error);
    AudioService.clearAudioBuffers(this.clientId);
    this.res.write(`data: ${JSON.stringify({ type: 'error', content: 'Stream error occurred' })}\n\n`);
    this.res.end();
  }

  async handleEnd() {
    try {
      if (this.buffer.trim()) {
        await this.processLine(this.buffer);
      }

      if (!this.isComplete) {
        // If stream ended without complete signal, send whatever audio we have
        const audioBuffer = await AudioService.getFinalAudio(this.clientId);
        if (audioBuffer.length > 0) {
          const finalAudioData = {
            type: 'audio',
            content: audioBuffer.toString('base64')
          };

          this.broadcastMessage(this.clientId, finalAudioData);
          this.res.write(`data: ${JSON.stringify(finalAudioData)}\n\n`);
        }
      }
    } catch (error) {
      console.error('Error handling stream end:', error);
    } finally {
      AudioService.clearAudioBuffers(this.clientId);
      this.res.end();
    }
  }
}

module.exports = StreamHandler;