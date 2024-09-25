import { ValueDispatcher } from '../events';
import { useLogger } from '../utils';
export class AudioManager {
    get onDataChanged() {
        return this.data.subscribable;
    }
    constructor(logger) {
        this.logger = logger;
        this.data = new ValueDispatcher(null);
        this.context = new AudioContext();
        this.audioElement = new Audio();
        this.source = null;
        this.error = false;
        this.abortController = null;
        this.offset = 0;
        if (import.meta.hot) {
            import.meta.hot.on('motion-canvas:assets', ({ urls }) => {
                if (this.source && urls.includes(this.source)) {
                    this.setSource(this.source);
                }
            });
        }
    }
    getTime() {
        return this.toAbsoluteTime(this.audioElement.currentTime);
    }
    setTime(value) {
        this.audioElement.currentTime = this.toRelativeTime(value);
    }
    setOffset(value) {
        this.offset = value;
    }
    setMuted(isMuted) {
        this.audioElement.muted = isMuted;
    }
    setSource(src) {
        this.source = src;
        this.audioElement.src = src;
        this.abortController?.abort();
        this.abortController = new AbortController();
        this.loadData(this.abortController.signal).catch(e => {
            if (e.name !== 'AbortError') {
                this.logger.error(e);
            }
        });
    }
    isInRange(time) {
        return time >= this.offset && time < this.audioElement.duration;
    }
    toRelativeTime(time) {
        return Math.max(0, time - this.offset);
    }
    toAbsoluteTime(time) {
        return time + this.offset;
    }
    isReady() {
        return this.source && !this.error;
    }
    /**
     * Pause/resume the audio.
     *
     * @param isPaused - Whether the audio should be paused or resumed.
     *
     * @returns `true` if the audio successfully started playing.
     */
    async setPaused(isPaused) {
        if (this.source && this.audioElement.paused !== isPaused) {
            if (isPaused) {
                this.audioElement.pause();
            }
            else {
                try {
                    await this.audioElement.play();
                    this.error = false;
                    return true;
                }
                catch (e) {
                    if (!this.error) {
                        useLogger().error(e);
                    }
                    this.error = true;
                }
            }
        }
        return false;
    }
    async loadData(signal) {
        this.data.current = null;
        if (!this.source) {
            return;
        }
        const response = await fetch(this.source, { signal });
        const rawBuffer = await response.arrayBuffer();
        if (signal.aborted)
            return;
        const audioBuffer = await this.decodeAudioData(rawBuffer);
        if (signal.aborted)
            return;
        const sampleSize = 256;
        const samples = ~~(audioBuffer.length / sampleSize);
        const peaks = [];
        let absoluteMax = 0;
        for (let channelId = 0; channelId < audioBuffer.numberOfChannels; channelId++) {
            const channel = audioBuffer.getChannelData(channelId);
            for (let i = 0; i < samples; i++) {
                const start = ~~(i * sampleSize);
                const end = ~~(start + sampleSize);
                let min = channel[start];
                let max = min;
                for (let j = start; j < end; j++) {
                    const value = channel[j];
                    if (value > max) {
                        max = value;
                    }
                    if (value < min) {
                        min = value;
                    }
                }
                if (channelId === 0 || max > peaks[i * 2]) {
                    peaks[i * 2] = max;
                }
                if (channelId === 0 || min < peaks[i * 2 + 1]) {
                    peaks[i * 2 + 1] = min;
                }
                if (max > absoluteMax) {
                    absoluteMax = max;
                }
                if (Math.abs(min) > absoluteMax) {
                    absoluteMax = Math.abs(min);
                }
            }
        }
        this.data.current = {
            peaks,
            absoluteMax,
            length: samples,
            sampleRate: (audioBuffer.sampleRate / sampleSize) * 2,
        };
    }
    decodeAudioData(buffer) {
        return new Promise((resolve, reject) => this.context.decodeAudioData(buffer, resolve, reject));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVkaW9NYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21lZGlhL0F1ZGlvTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFHbkMsTUFBTSxPQUFPLFlBQVk7SUFDdkIsSUFBVyxhQUFhO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDaEMsQ0FBQztJQVVELFlBQW9DLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBVGpDLFNBQUksR0FBRyxJQUFJLGVBQWUsQ0FBbUIsSUFBSSxDQUFDLENBQUM7UUFFbkQsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0IsaUJBQVksR0FBcUIsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN0RCxXQUFNLEdBQWtCLElBQUksQ0FBQztRQUM3QixVQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2Qsb0JBQWUsR0FBMkIsSUFBSSxDQUFDO1FBQy9DLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFHakIsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBQyxFQUFFLEVBQUU7Z0JBQ3BELElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzdCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFTSxPQUFPO1FBQ1osT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFD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