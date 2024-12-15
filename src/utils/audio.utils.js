const { Readable } = require('stream');

class AudioUtils {
    static base64ToBuffer(base64String) {
        return Buffer.from(base64String, 'base64');
    }

    static async concatenateAudioBuffers(audioBuffers) {
        // Assuming WAV format, we need to:
        // 1. Keep the header from the first file
        // 2. Concatenate only the data portions of subsequent files
        if (!audioBuffers.length) return Buffer.alloc(0);

        const firstBuffer = audioBuffers[0];
        const headerLength = 44; // Standard WAV header length

        // Extract header from first buffer
        const header = Buffer.from(firstBuffer.slice(0, headerLength));

        // Concatenate data portions
        const audioData = Buffer.concat(
            audioBuffers.map((buffer, index) =>
                index === 0 ? buffer.slice(headerLength) : buffer.slice(headerLength)
            )
        );

        // Update header with new data size
        const dataSize = audioData.length;
        const fileSize = dataSize + headerLength - 8;

        // Update file size in header (4-byte value at offset 4)
        header.writeUInt32LE(fileSize, 4);

        // Update data chunk size in header (4-byte value at offset 40)
        header.writeUInt32LE(dataSize, 40);

        // Combine header with concatenated audio data
        return Buffer.concat([header, audioData]);
    }

    static createReadableStream(buffer) {
        return Readable.from(buffer);
    }

    static async streamToBuffer(stream) {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
}

module.exports = AudioUtils;