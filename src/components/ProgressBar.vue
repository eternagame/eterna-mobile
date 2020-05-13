<template>
    <b-container style="padding:0">
        <b-progress :max="circleCount()" class="puzzle-progress-bar">
            <b-progress-bar :value="progressBarFill()" style="background-color: rgb(21, 194, 231);"/>
        </b-progress>
        <b-row class="puzzle-progress-bar-circles">
            <div v-for="n in circleCount()" :key="n" class="circle">
                <div v-if="n == 1" class="inner-circle" />
                <div v-else-if="n == circleCount()" class="puzzle-progress-bar-icon-test-tube" />
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
    mounted() {
        var circles = this.$el.getElementsByClassName('circle') as HTMLCollectionOf<HTMLElement>;

        var glowingCircles = Math.max(0, Math.min(circles.length, this.value >= this.max ? circles.length : this.value));
        for (var i = 0; i <= glowingCircles; i++) {
            circles[i].style.backgroundColor = "rgb(21, 194, 231)";
            circles[i].style.boxShadow = '0vmin 0vmin 4vmin 0.5vmin rgb(21, 194, 231)';
            circles[i].style.zIndex = (circles.length - i).toString();
        }
    },
    methods: {
        lerp(a : number, b : number, t : number) {
            return a + t * (b - a);
        },
        circleCount() {
            return this.max + 2;
        },
        progressBarFill() {
            return this.value >= this.max ?
                this.circleCount() :
                this.lerp(0.6, this.circleCount() - 0.6, this.value / this.max);
        }
    }
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
    top: -4.9vmin;
    position: relative;
}

.circle {
    height: 7vmin;
    width:  7vmin;
    background-color: rgb(204, 204, 204);
    border-radius: 50%;
    overflow: visible;
    display: inline-block;
    font-size: 4vmin;
    padding-top: 0.5vmin;
}

.inner-circle {
    height: 3.5vmin;
    width:  3.5vmin;
    border-radius: 50%;
    background-color: white;
    display: inline-block;
    margin-top: 1.2vmin;
}

.puzzle-progress-bar-icon-test-tube {
    background-image: url('../assets/test-tube.svg');
    background-position: center; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 3.7vmin;
    height: 3.7vmin;
    display: inline-block;
    margin-top: 1.0vmin;
}
</style>