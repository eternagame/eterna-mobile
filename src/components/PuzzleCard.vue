<template>
    <div class="puzzle-card-container">
        <b-img  class="puzzle-card-image" :src="source" />
        <div style="justify-content:center;align-items:center">
            <b-button v-if="state === 'unlocked'" class="puzzle-card-button" variant="primary" to="game/6502944">
                <b class="puzzle-card-button-text">
                    CONTINUE
                </b>
            </b-button>
            <b v-else-if="state === 'locked'" class="puzzle-card-text">
                Locked
            </b>
            <b v-else-if="state === 'completed'" class="puzzle-card-text">
                COMPLETED!
            </b>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.component('puzzle-card', {
    props: {
        highlight: {
            type: Boolean,
            default: false
        },
        state: {
            type: String,
            default: 'unlocked'
        },
        source: {
            type: String,
            default: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png'
        }
    },
    mounted() {
        const el = this.$el as HTMLElement;
        const data = this.$data;
        const props = this.$props;

        const state = data.state;

        switch (props.state) {
            case 'locked': {
                el.style.opacity = '50%';
            }
            break;
            case 'unlocked':{}
            break;
            case 'completed': {}
            break;
        }

        if (props.highlight) {
            el.style.boxShadow = '0px 0px 2.5vmin 0.25vmin rgb(21, 194, 231)';
        }
    }
})
</script>

<style lang="scss" scoped>
.puzzle-card-container {
    width: 45vmin;
    height: 45vmin;
    display: inline-block;
    border-radius: 2vmin;
    background-color: #008cff15;
    scroll-snap-align: center;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 1vmin;
    margin-right: 1vmin;
}

.puzzle-card-image {
    height: 65%;
    margin-top: 14%;
    margin-bottom: 1vh;
}

.puzzle-card-button {
    margin-top: 3%;
    padding: 0;
    width: 49%;
    height: 5.5vmin;
    line-height: 0;
    position: initial;
    border-radius: 1vmin;
}

.puzzle-card-button-text {
    font-size: 3.2vmin;
    text-align: center;
    line-height: 0;
}

.puzzle-card-text {
    font-size: 2.5vmin;
    text-align: center;
    transform: translateY(3.5vmin);
    line-height: 0;
}
</style>