<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    let steps = Array(16).fill(false);
    const dispatch = createEventDispatcher();

    function toggleStep(index: number) {
        steps[index] = !steps[index];
        dispatch('step', { index, state: steps[index] });
    }
</script>

<div class="grid">
    {#each steps as state, index}
        <button on:click={() => toggleStep(index)} class="{state ? 'active' : ''}">
            Step {index + 1}
        </button>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        gap: 10px;
        grid-template-columns: repeat(4, 1fr);
    }
    .active {
        background-color: green;
    }
</style>