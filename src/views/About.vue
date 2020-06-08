<template>
<div class="puzzle-view-container">
    <b-row id="puzzle-view-header">
        <b-col>
            <b-img :src="logoSourcePng" />
        </b-col>
        <b-col style="display:flex;">
        </b-col>
        <b-col>
            <b-row style="justify-content:flex-end">
                <a class="close-button" @click="back"></a>
            </b-row>
        </b-col>
    </b-row>
    <b-row id="about-content">
        <b-col class="info-col">
            <p style="font-size:larger">Eterna empowers citizen scientists to invent medicine through <strong>molecular design</strong>.</p>
            <p>You play by solving puzzles using RNAs,<br>tiny molecules at the heart of every cell.</p>
            <p><strong>Learn more at <a href="https://eternagame.org">eternagame.org</a></strong></p>
        </b-col>
        <b-col class="video-col">
            <video class="video" @click="toggleVideo" :poster="videoPosterSourcePng">
                <source :src="videoSourceMp4" type="video/mp4">
            </video>
        </b-col>
    </b-row>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            logoSourcePng: require('../assets/logo_eterna.svg').default,
            videoSourceMp4: require('../assets/WhatIsEterna_360p.mp4').default,
            videoPosterSourcePng: require('../assets/WhatIsEterna_snapshot.png').default,
        };
    },
    methods: {
        toggleVideo(event: Event) {
            if (event?.target) {
                const video = event.target as HTMLMediaElement;
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        },
        back() {
            this.$router.back();
        },
    },
});
</script>

<style lang="scss" scoped>
#about-content {
    margin-left: 0;
    margin-right: 0;
}
.info-col {
    padding-left: 45px;
    padding-right: 5px;
    text-align: left;
    margin-top: auto;
    margin-bottom: auto;
}
.video-col {
    padding-right: 45px;
    padding-left: 0;
}
.video {
    width: 100%;
}
</style>
