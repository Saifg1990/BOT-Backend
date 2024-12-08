class WebSocketClient {
    constructor() {
        this.connect();
        this.messageHandlers = new Set();
    }

    connect() {
        this.ws = new WebSocket(`ws://${window.location.host}`);
        this.ws.onmessage = (event) => this.handleMessage(event);
        this.ws.onclose = () => setTimeout(() => this.connect(), 1000);
    }

    handleMessage(event) {
        const data = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(data));
    }

    addMessageHandler(handler) {
        this.messageHandlers.add(handler);
    }

    removeMessageHandler(handler) {
        this.messageHandlers.delete(handler);
    }

    send(data) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}

const wsClient = new WebSocketClient();