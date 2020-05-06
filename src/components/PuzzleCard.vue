<template>
    <div class="puzzle-card-container">
        <b-img  class="image" :src="source" />
        <div>
            <b-button v-if="state === 'unlocked'" class="button" size="sm" variant="primary">
                CONTINUE
            </b-button>
            <p v-else-if="state === 'locked'">
                Locked
            </p>
            <p v-else-if="state === 'completed'">
                Completed
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

enum State {
    Locked,
    Unlocked,
    Completed,
}

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
    data() {
        return {
        } 
    },
    mounted() {
        const el = this.$el as HTMLElement;
        const data = this.$data;
        const props = this.$props;

        const state = data.state;

        switch (props.state) {
            case 'locked': {
                el.style.opacity = "50%";
            }
            break;
            case 'unlocked':{}
            break;
            case 'completed': {}
            break;
        }

        if (props.highlight) {
            el.style.boxShadow = '0px 0px 2vmin 1vmin #50b2dc';
        }
    }
})
</script>

<style lang="scss" scoped>
.puzzle-card-container {
    width:  40vmin;
    height: 40vmin;
    display: inline-block;
    border-radius: 2vmin;
    background-color: #ffffff10;
    scroll-snap-align: center;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
}

.image {
    height: 65%;
    margin-top: 14%;
}

.button {
    margin-top: 5%;
    width: 60%;
    height: 7%;
}
</style>