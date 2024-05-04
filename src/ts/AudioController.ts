// We import Tone in TypeScript, remember it should be installed as a dependency
import * as Tone from 'tone';

class AudioController {
    private steps: boolean[];
    private loops: Tone.Loop[];
    private isPlaying: boolean;

    constructor() {
        this.steps = Array(16).fill(false);
        this.loops = Array(16).fill(null).map((_, i) => {
            const synth = new Tone.Synth().toDestination();
            return new Tone.Loop((time) => {
                if (this.steps[i]) {
                    synth.triggerAttackRelease("C2", "8n", time);
                }
            }, "4n");
        });
        this.isPlaying = false;
    }

    toggleStep(stepIndex: number) {
        this.steps[stepIndex] = !this.steps[stepIndex];
    }

    startStopLoop() {
        this.isPlaying = !this.isPlaying;

        if (this.isPlaying) {
            this.loops.forEach(loop => loop.start(0));
            Tone.Transport.start();
        } else {
            this.loops.forEach(loop => loop.stop());
            Tone.Transport.stop();
        }
    }

}

export default AudioController;