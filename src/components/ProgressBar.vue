<template>
    <b-container>
        <b-progress max="9" class="puzzle-progress-bar">
            <b-progress-bar :value="lerp(0.45, 9 - 0.45, value / 7)" style="background-color: rgb(21, 194, 231);"/>
        </b-progress>
        <b-row class="puzzle-progress-bar-circles">
            <b-col v-for="n in 9" :key="n">
                <div class="circle">
                    <div>
                        <div v-if="n == 1" class="inner-circle" /> 
                        <b v-else-if="n == 9">A</b>
                        <b v-else>{{ n - 1 }}</b>
                    </div>
                </div>
            </b-col>
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
        }
    },
    mounted() {
        var circles = this.$el.getElementsByClassName('circle') as HTMLCollectionOf<HTMLElement>;

        for (var i = 0; i <= this.value; i++) {
            circles[i].style.backgroundColor = "rgb(21, 194, 231)";
            circles[i].style.boxShadow = '0px 0px 15px 2px rgb(21, 194, 231)';
        }
    },
    methods: {
        lerp(a : number, b : number, t : number) {
            return a + t * (b - a);
        }
    }
})
</script>

<style lang="scss" scoped>
.puzzle-progress-bar {
    overflow: visible;
    background-color: rgb(204, 204, 204);
    height: 2.8vmin;
    margin-left: 4%;
    margin-right: 4%;
}

.puzzle-progress-bar-circles {
    position:relative;
    top:-4.9vmin;
    justify-content: flex-end;
    flex-wrap: nowrap;
}

.circle {
    height: 7vmin;
    width:  7vmin;
    background-color: rgb(204, 204, 204);
    border-radius: 50%;
    display: inline-block;
    overflow: visible;
}

.inner-circle {
    height: 3vmin;
    width:  3vmin;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
    overflow: visible;
}
</style>