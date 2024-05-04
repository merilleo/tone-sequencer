<script lang="ts">

    // ------ Constants and interface definitions ---------
    const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const STEP = 360 / NOTES.length;


    // -------------- Prop declarations --------------
    export let active = true;
    export let note = 'C4';
    export let isPlaying = false;
    export let randomize = 0;
    export let reset = false;

    // State variables
    let position = 0;
    let rotation = 0;
    let initialY = 0;
    let deltaY = 0;
    let mouseDown = false;
    let justClicked = false;


    // -------------- Reactive statements --------------
    $: {
        if (randomize !== 0) {
            randomRotation();
        }
    }

    $: if (reset) resetKnob();


    // -------------- Functions --------------
    function resetKnob() {
        position = 0;
        rotation = 0;
        note = 'C4';
        active = true;
        reset = false;
    }


    function rotate(isClockwise = true) {
        const change = isClockwise ? 1 : -1;

        if (checkRotationLimit(isClockwise)) {
            position = (position + NOTES.length + change) % NOTES.length;
            rotation += STEP * change;
        }

        updateNote();
    }

    function randomRotation() {
        const randomNumber = Math.random() * (Math.random() * randomize);
        const randomDirection = Math.random() > 0.5;
        active = Math.random() > 0.5;

        for (let i = 0; i < randomNumber; i++ ) {
            rotate(randomDirection);
        }
    }

    function checkRotationLimit(isClockwise: boolean) {
        const isUpperLimit = rotation < 1770 && isClockwise;
        const isLowerLimit = rotation > -1440 && !isClockwise;

        return isUpperLimit || isLowerLimit;
    }

    function updateNote() {
        const activeNote = position % NOTES.length;
        const octave = 4 + Math.floor(rotation / 360);
        note = `${NOTES[activeNote]}${octave}`;
    }



    // -------------- Event Stuff --------------

    const handleDragStart = (event) => {
        event.preventDefault();
        initialY = event.touches ? event.touches[0].clientY : event.clientY;
        mouseDown = true;
        justClicked = true;

        addDragListeners();
    };

    const handleDrag = (event) => {
        if (mouseDown) {
            const currentY = event.touches ? event.touches[0].clientY : event.clientY;
            deltaY = initialY - currentY;

            if (Math.abs(deltaY) > 10) { // Tweak this to change the sensitivity of the dragging.
                rotate(deltaY > 0);
                initialY = currentY;
                justClicked = false;
            }
        }

    };
    const handleDragEnd = (event) => {
        if (justClicked) active = !active;

        initialY = 0;
        deltaY = 0;
        mouseDown = false;

        removeDragListeners();
    }

    function addDragListeners() {
        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleDragEnd);
    }
    function removeDragListeners() {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
    }

</script>
<div class="container {isPlaying ? 'playing' : ''}">
    <div
            role="slider"
            aria-valuemin="0"
            aria-valuemax="1770"
            aria-valuenow={rotation}
            aria-valuetext={note}
            tabindex="0"
            style="transform: rotate({rotation - 1.5 * STEP}deg);"
            class="rotator {active ? 'active' : ''} "
            on:mousedown={handleDragStart}
            on:mousemove={handleDrag}
            on:mouseup={handleDragEnd}
            on:touchstart={handleDragStart}
            on:touchmove={handleDrag}
            on:touchend={handleDragEnd}
    >
        <div class="note" style="transform: rotate({-rotation + 1.5 * STEP}deg);">
            {note}
            {#each NOTES as note, i}
                <div class="point {i === position % NOTES.length ? 'active' : ''}" style="
               transform: rotate({i * STEP}deg) translate(50px) rotate(-{i * STEP}deg);"></div>
            {/each}
        </div>


    </div>
</div>

<style>
    .rotator {
        position: relative;
        width: 50px;
        height: 50px;
        border: 1px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.1s;
        border-radius: 100% 100% 0 100%;
        cursor: pointer;
    }

    .rotator.active {
        background-color: #152bab;
        color: #fff;
    }

    .playing .rotator {
        box-shadow: rgba(0, 0, 0, 0.2) 0 0 28px 5px
    }
    .playing .rotator.active {
        box-shadow: #152bab 0 0 70px 4px
    }

    .note {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform 0.1s;
    }

    .point {
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 5px;
        background-color: #dee3ed;
        transition: background-color 0.1s;
    }
    .point.active {
        background-color: #152bab;
    }
</style>