<script lang="ts">
    import {writable} from "svelte/store";
    import * as Tone from "tone";
    import NoteKnob from "./lib/NoteKnob.svelte";
    import RotaryKnob from "./lib/RotaryKnob.svelte";

    let isStartup = writable(true);
    let isPlaying = writable(false);

    let steps = Array.from({length: 16}, () => ({ active: true, note: "C4", currentlyPlaying: false }));
    let randomize = 0;
    let reset = false;

    // Settings
    let volume = 0.5;
    let bpm = 120;
    let portamento = 0;

    // Envelope
    let attack = 0.01;
    let decay = 0.01;
    let sustain = 1;
    let release = 0.5;

    const volNode = new Tone.Volume(lin2dec(volume)).toDestination();
    /*const reverb = new Tone.Reverb({
        decay: 1.1,
        preDelay: 0.01
    }).connect(volNode);*/

    const synthA = new Tone.FMSynth({
        envelope: {
            attack: attack,
            decay: decay,
            sustain: sustain,
            release: release
        }
    }).connect(volNode);

    Tone.getTransport().bpm.value = 120;

    let currentStep = 0;
    let count = 0;
    const loopA = new Tone.Loop((time) => {
        steps = steps.map(step=>({...step, currentlyPlaying: false}));
        const currentKnob = steps[currentStep];
        steps = Object.assign([], steps, { [currentStep]: { ...currentKnob, currentlyPlaying: true }});
        if (currentKnob.active) {
            currentKnob.currentlyPlaying = true;

            synthA.triggerAttackRelease(currentKnob.note, "32n", time);
        }
        count ++;
        currentStep = count % 16;
    }, "16n").start(0);

    function playSomething() {
        let isPlayingValue;
        isPlaying.subscribe(value => isPlayingValue = value);

        if (isPlayingValue) {
            isPlaying.set(false);
            Tone.getTransport().stop();
            return;
        } else {
            isPlaying.set(true);
            Tone.getTransport().start();
        }
    }

    function lin2dec(volume: number) {
        return 20 * (0.5 * Math.log10(volume));
    }

    function setVolume(newVolume:number) {
        volume = newVolume;
        volNode.volume.value = lin2dec(volume);
    }
    function setBPM(newBPM) {
        bpm = newBPM;
        Tone.getTransport().bpm.value = bpm;
    }

    function setRandomize() {
        randomize = Math.random() * 5;
    }
    function setReset() {
        reset = true;
    }

    // -------------- Reactive statements --------------
    $: {
        setVolume(volume);
        setBPM(bpm);
        synthA.envelope.attack = attack;
        synthA.envelope.decay = decay;
        synthA.envelope.sustain = sustain;
        synthA.envelope.release = release;
        synthA.portamento = portamento;
    }
</script>

<main>
    {#if $isStartup}
        <button on:click={()=>isStartup.set(false)}>Start App</button>
    {:else}

        <div class="tone-generator">
            <div class="settings">
                <h3>Tone Generator</h3>
                <div class="row grid-3 gap">
                    <button on:click={playSomething}>{$isPlaying ? 'Stop':'Start'}</button>
                    <button on:click={setRandomize}>Randomize</button>
                    <button on:click={setReset}>Reset</button>
                </div>
                <div class="row grid-3 gap">
                    <RotaryKnob
                            bind:value ={volume}
                            min ={0}
                            max ={1}
                            step = {0.01}
                            label="Volume"
                    />
                    <RotaryKnob
                            bind:value ={bpm}
                            min ={20}
                            max ={250}
                            step = {1}
                            label="BPM"
                    />
                    <RotaryKnob
                            bind:value ={portamento}
                            min ={0}
                            max ={1}
                            step = {0.01}
                            label="Portamento"
                    />
                </div>
                <div class="row grid-4 gap">
                    <RotaryKnob
                            bind:value={attack}
                            min={0.01}
                            max={2}
                            step={0.01}
                            label="Attack"
                    />
                    <RotaryKnob
                            bind:value={decay}
                            min={0.01}
                            max={2}
                            step={0.01}
                            label="Decay"
                    />
                    <RotaryKnob
                            bind:value={sustain}
                            min={0}
                            max={1}
                            step={0.01}
                            label="Sustain"
                    />
                    <RotaryKnob
                            bind:value={release}
                            min={0.1}
                            max={3}
                            step={0.01}
                            label="Release"
                    />
                </div>
            </div>

            <div class="knobs grid-4 gap-85">
                {#each steps as step, index}
                    <NoteKnob bind:note={step.note}
                              bind:active={step.active}
                              bind:isPlaying={step.currentlyPlaying}
                              bind:randomize={randomize}
                              bind:reset={reset}
                    />
                {/each}
            </div>
        </div>

    {/if}
</main>


<style>
    .tone-generator {
        padding: 3rem;
        border: 1px solid #b6b6b6;
        border-radius: 25px;
        background-color: #f1f3f9;
    }
    .tone-generator .settings {
        padding-bottom: 2rem;
        border: 1px solid #b6b6b6;
        border-radius: 25px;
    }

    .knobs {
        padding-top: 40px;
    }
</style>