<script lang="ts">
    import {writable} from "svelte/store";
    import * as Tone from "tone";
    import NoteKnob from "./lib/NoteKnob.svelte";
    import RotaryKnob from "./lib/RotaryKnob.svelte";
    import fontText from "./assets/LCD14.txt?raw";

    let isStartup = writable(true);
    let isPlaying = writable(false);

    let steps = Array.from({length: 16}, () => ({ active: true, note: "C4", currentlyPlaying: false }));
    let randomize = 0;
    let randomizeBeat = 0;
    let reset = false;

    // Settings
    let volume = 0.5;
    let bpm = 120;
    let swing = 0;
    let portamento = 0;
    let harmonicity = 2.5;

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

    /*const synthA = new Tone.FMSynth({
        envelope: {
            attack: attack,
            decay: decay,
            sustain: sustain,
            release: release
        }
    }).connect(volNode);*/


    const synthA = new Tone.AMSynth(
    {
        "volume": 0,
        "detune": 0,
        "portamento": portamento,
        "harmonicity": harmonicity,
        "oscillator": {
            "partialCount": 0,
            "phase": 0,
            "type": "sine"
        },
        "envelope": {
            "attack": attack,
            "attackCurve": "linear",
            "decay": decay,
            "decayCurve": "exponential",
            "release": release,
            "releaseCurve": "exponential",
            "sustain": sustain
        },
        "modulation": {
            "partials": [
                0.7060667438271604,
                0.019775390625
            ],
            "phase": 0,
            "type": "custom"
        },
        "modulationEnvelope": {
            "attack": 0.01,
            "attackCurve": "linear",
            "decay": 0.01,
            "decayCurve": "exponential",
            "release": 0.5,
            "releaseCurve": "exponential",
            "sustain": 1
        }
    }).connect(volNode);

    const membraneSynth = new Tone.Sampler({
        urls: {
            A1: "A1.mp3",
            A2: "A2.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/casio/",
        onload: () => {
            membraneSynth.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
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
        if (currentStep % 4 === 0) {
            // membraneSynth.triggerAttackRelease("C1", "8n");
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
        randomize = Math.random() * 8;
    }
    function setRandomizeBeat() {
        randomizeBeat = 1;
    }
    function setReset() {
        reset = true;
    }

    // -------------- Reactive statements --------------
    $: {
        setVolume(volume);
        setBPM(bpm);
        Tone.getTransport().swing = swing;
        synthA.envelope.attack = attack;
        synthA.envelope.decay = decay;
        synthA.envelope.sustain = sustain;
        synthA.envelope.release = release;
        // synthA.modulation.phase = detune;
        synthA.harmonicity.value = harmonicity;
        synthA.portamento = portamento;
    }

</script>

<main>

    {#if $isStartup}
        <div class="load-tone-generator">
            <button on:click={()=>isStartup.set(false)}>PLAY SOME MUSIC</button>
        </div>
    {:else}

        <div class="tone-generator">
            <div style="--font:{fontText}"></div>
            <div class="module settings">
                <h3 class="module-title">LOOPER</h3>
                <div class="start-section row grid-2 gap">
                    <button class="start-button {$isPlaying ? 'active':''}" on:click={playSomething}>{$isPlaying ? 'STOP':'START'}</button>
                    <div class="loop-indicator">
                        {#each Array(4).fill(0) as _, i}
                            <div class="loop-indicator-light {(currentStep+3) % 4 === i ? 'active' : ''}"></div>
                        {/each}
                    </div>
                </div>
                <div class="row grid-3 gap">
                    <RotaryKnob
                            bind:value ={volume}
                            min ={0}
                            max ={1}
                            step = {0.01}
                            labelMultiplier="{100}"
                            label="VOLUME"
                    />
                    <RotaryKnob
                            bind:value ={bpm}
                            min ={20}
                            max ={250}
                            step = {1}
                            label="BPM"
                    />
                    <RotaryKnob
                            bind:value ={swing}
                            min ={0}
                            max ={1}
                            step = {0.005}
                            labelMultiplier="{100}"
                            label="SWING"
                    />
                </div>

            </div>
            <div class="module knobs ">
                <h3 class="module-title">AMSYNTH</h3>
                <div class="knob-settings row grid-3 gap">
                    <button on:click={setRandomize}>RANDOM NOTES</button>
                    <button on:click={setRandomizeBeat}>RANDOM BEAT</button>
                    <button on:click={setReset}>RESET</button>
                </div>
                <h5 class="module-subtitle">SETTINGS</h5>
                <div class="row grid-3 gap">
                    <!--<RotaryKnob
                            bind:value ={detune}
                            min ={0}
                            max ={360}
                            step = {1}
                            walabel="Detune"
                    />-->
                    <RotaryKnob
                            bind:value ={harmonicity}
                            min ={0}
                            max ={3}
                            step = {0.01}
                            labelMultiplier="{33.3}"
                            label="HARMONICITY"
                    />
                    <RotaryKnob
                            bind:value ={portamento}
                            min ={0}
                            max ={1}
                            step = {0.005}
                            labelMultiplier="{100}"
                            label="PORTAMENTO"
                    />
                </div>
                <h5 class="module-subtitle">ENVELOPE</h5>
                <div class="row grid-4 gap">
                    <RotaryKnob
                            bind:value={attack}
                            min={0.01}
                            max={2}
                            step={0.01}
                            labelMultiplier="{50}"
                            label="ATTACK"
                    />
                    <RotaryKnob
                            bind:value={decay}
                            min={0.01}
                            max={2}
                            step={0.01}
                            labelMultiplier="{50}"
                            label="DECAY"
                    />
                    <RotaryKnob
                            bind:value={sustain}
                            min={0}
                            max={1}
                            step={0.01}
                            labelMultiplier="{100}"
                            label="SUSTAIN"
                    />
                    <RotaryKnob
                            bind:value={release}
                            min={0.1}
                            max={3}
                            step={0.01}
                            labelMultiplier="{33.3}"
                            label="RELEASE"
                    />
                </div>
                <h5 class="module-subtitle">SEQUENCER</h5>
                <div class="grid-4 knob-gap">
                    {#each steps as step, index}
                        <NoteKnob bind:note={step.note}
                                  bind:active={step.active}
                                  bind:isPlaying={step.currentlyPlaying}
                                  bind:randomize={randomize}
                                  bind:randomizeBeat={randomizeBeat}
                                  bind:reset={reset}
                        />
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</main>


<style>
    .load-tone-generator {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .start-section {
        margin-bottom: 1rem;
    }
    .start-button {
        width: 100%;
    }
    .module {
        padding: 1.5rem 3rem;
        border-radius: 25px;
        box-shadow: 10px 10px var(--sequencer-color-gray-500);
        background: var(--sequencer-color-gray-200);
        margin-top: 1rem;
    }
    .module-title {
        margin-top: 0;
        box-shadow: inset 0px 5px var(--sequencer-color-gray-500);
        border-radius: 15px;
        background-color: var(--sequencer-color-gray-300);
        text-align: center;
        padding: .5em;
        padding-bottom: 0;
    }
    .module-subtitle {
        margin: 1rem 0 0.5rem 0;
        box-shadow: inset 0px 5px var(--sequencer-color-gray-500);
        border-radius: 15px;
        background-color: var(--sequencer-color-gray-300);
        text-align: center;
        padding: .5rem;
    }

    .loop-indicator {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .loop-indicator-light {
        width: 25px;
        height: 25px;
        margin-right: 1rem;
        border-radius: 100%;
        background-color: var(--sequencer-color-gray-100);
        box-shadow: 0px 3px 0 1px var(--sequencer-color-gray-500);
    }
    .loop-indicator-light.active {
        background-color: var(--sequencer-color-primary);
    }
    .settings {

    }

    .knobs {
        padding: 3rem;
        padding-top: 1.5rem;
    }
    .knobs .module-title {

    }
    .knob-settings {
        margin-bottom: 2rem;
    }
    .knob-gap {
        row-gap: 50px;
        column-gap: 17px;
        margin-top: 2rem;
    }
</style>