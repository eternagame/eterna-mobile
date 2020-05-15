<template>
    <b-container style="padding:0">
        <b-progress :max="circleCount" class="puzzle-progress-bar">
            <b-progress-bar :value="progressBarFill" style="background-color: rgb(21, 194, 231);"/>
        </b-progress>
        <b-row class="puzzle-progress-bar-circles">
            <div v-for="n in circleCount" :key="n" class="circle" :class="{'circle-glow': (n - 1) <= value}">
                <div v-if="n === 1" class="inner-circle" />
                <div v-else-if="n === circleCount" class="puzzle-progress-bar-icon-test-tube" />
                <b v-else>{{ n - 1 }}</b>
            </div>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.component('puzzle-view-progress-bar', {
    props: {
        value: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 7,
        }
    },
    computed: {
        circleCount(): number {
            return this.max + 1;
        },
        progressBarFill(): number {
            const t = this.clamp(this.value / this.max, 0, 1);
            return this.lerp(0, this.circleCount, t);
        },
    },
    mounted() {
        let circles = this.$el.getElementsByClassName('circle') as HTMLCollectionOf<HTMLElement>;
        for (var i = 0; i < circles.length; i++) {
            circles[i].style.zIndex = (circles.length - i).toString();
        }
    },
    methods: {
        lerp(a : number, b : number, t : number) {
            return a + t * (b - a);
        },
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        },
    },
})
</script>

<style lang="scss" scoped>
.puzzle-progress-bar {
    background-color: rgb(204, 204, 204);
    height: 2.8vmin;
}

.puzzle-progress-bar-circles {
    justify-content: space-between;
    flex-wrap: nowrap;
    top: -4.4vmin;
    position: relative;
}

.circle {
    height: 6vmin;
    width: 6vmin;
    background-color: rgb(204, 204, 204);
    border-radius: 50%;
    overflow: visible;
    display: inline-block;
    font-size: 3.5vmin;
    padding-top: 0.4vmin;
    z-index: 0;
}

.circle-glow {
    background-color: rgb(21, 194, 231);
    box-shadow: 0vmin 0vmin 4vmin 0.5vmin rgb(21, 194, 231);
}

.inner-circle {
    height: 3.5vmin;
    width: 3.5vmin;
    border-radius: 50%;
    background-color: white;
    display: inline-block;
    margin-top: 0.9vmin;
}

.puzzle-progress-bar-icon-test-tube {
    background-image: url('../assets/test-tube.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 3.7vmin;
    height: 3.7vmin;
    display: inline-block;
    margin-top: 0.4vmin;
}
</style>
