<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    let isPlaying = false;
    const dispatch = createEventDispatcher();

    function toggle() {
        isPlaying = !isPlaying;
        dispatch('toggle', isPlaying);
    }
</script>

<button on:click={toggle}>
    {#if isPlaying}
        Stop
    {:else}
        Play
    {/if}
</button>