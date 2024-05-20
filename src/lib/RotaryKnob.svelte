<script lang="ts">

    // ----- Constants -----
    const MAX_ROTATION = 360;
    const MIN_ROTATION = 90;

    // ------- Prop declarations -------
    export let value = 0;
    export let min = 0;
    export let max = 10;
    export let step = 1;
    export let labelMultiplier = 1;
    export let label = '';
    export let unit = '';

    // State variables
    let steps = Math.floor((max - min) / step);
    let rotationStep = (MAX_ROTATION - MIN_ROTATION) / steps;
    let rotation = (Math.floor((value - min) / step) * rotationStep) + MIN_ROTATION;
    let mouseDown = false;
    let initialY = 0;
    let deltaY = 0;

    // ---- Functions ------

    function getRotationFromEvent(event) {
        let newRotation = rotation;
        const currentY = event.touches ? event.touches[0].clientY : event.clientY;
        deltaY = initialY - currentY;

        if (Math.abs(deltaY) >= 1) {
            newRotation = rotation + rotationStep * Math.sign(deltaY);
            initialY = currentY;
        }

        if (newRotation < MIN_ROTATION) {
            newRotation = MIN_ROTATION;
        } else if (newRotation > MAX_ROTATION) {
            newRotation = MAX_ROTATION;
        }

        return newRotation;
    }

    // ---- Mouse Handlers ------

    const handleMouseDown = (event) => {
        event.preventDefault();
        initialY = event.touches ? event.touches[0].clientY : event.clientY;
        mouseDown = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseUp = () => {
        mouseDown = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (event) => {
        if (mouseDown) {
            rotation = getRotationFromEvent(event);
            value = Math.round(((rotation - MIN_ROTATION) / rotationStep)) * step + min;
        }
    }
</script>

<div class="container">
    <p class="title">{label}</p>
    <div
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={value.toString()}
            tabindex="0"
            class="rotator"
            style="transform: rotate({rotation}deg);"
            on:mousedown={handleMouseDown}
    >
        <div class="label" style="transform: rotate({-rotation}deg);">{(value * labelMultiplier).toFixed(0)} {unit}</div>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .title {
        margin-top: 0;
        margin-bottom: 1rem;
    }
    .rotator {
        position: relative;
        width: var(--sequencer-knob-size);
        height: var(--sequencer-knob-size);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #000;
        background-color: var(--sequencer-color-gray-700);
        border-radius: 100% 100% 0 100%;
        cursor: pointer;
    }

    .label {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 1px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        background-color: var(--sequencer-color-white);
        border: none;
        box-shadow: 0px 3px 0 1px var(--sequencer-color-gray-500);
    }
</style>