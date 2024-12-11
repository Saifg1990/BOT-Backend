class StreamHandler {
  constructor(res, clientId, broadcastMessage) {
    this.res = res;
    this.clientId = clientId;
    this.broadcastMessage = broadcastMessage;
    this.buffer = '';
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

  processLine(line) {
    if (!line.trim()) return;

    try {
      const data = JSON.parse(line);
      if (data.type === 'text' || data.type === 'audio') {
        this.broadcastMessage(this.clientId, data);
        this.res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    } catch (error) {
      console.error('Error parsing line:', error);
    }
  }

  handleError(error) {
    console.error('Stream error:', error);
    this.res.write(`data: ${JSON.stringify({ type: 'error', content: 'Stream error occurred' })}\n\n`);
    this.res.end();
  }

  handleEnd() {
    if (this.buffer.trim()) {
      this.processLine(this.buffer);
    }
    this.res.end();
  }
}

module.exports = StreamHandler;