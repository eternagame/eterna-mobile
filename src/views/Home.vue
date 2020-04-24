<template>
<div id="home">
    <div id="menu">
        <input class="form-control" v-model.trim="username" required="" type="username" placeholder="username">
        <input class="form-control" v-model="password" required="" type="password" placeholder="password">
        <router-link to="reset-password">
            <button class="clickable-text">Forgot your password?</button>
        </router-link>
        <button class="btn-primary" v-on:click="login">ENTER</button>
        <router-link to="register">
            <button class="clickable-text">Register here</button>
        </router-link>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            username: '',
            password: '',
        }
    },
    methods: {
        login() {
            console.log('login');
        }
    },
});
</script>

<style lang="scss">

@import 'src/common';

/* Portrait layout (default) */
#home {
    background: url('../assets/logo_eterna.svg') no-repeat center top; /* 170px x 200px */
    position: absolute;             /* position in the center of the screen */
    left: 50%;
    top: 50%;
    height: 50px;                   /* text area height */
    width: 225px;                   /* text area width */
    text-align: center;
    padding: 180px 0px 0px 0px;     /* image height is 200px (bottom 20px are overlapped with text) */
    margin: -115px 0px 0px -112px;  /* offset vertical: half of image height and text area height */
                                    /* offset horizontal: half of text area width */
}

/* Landscape layout (with min-width) */
@media screen and (min-aspect-ratio: 1/1) and (min-width:400px) {
    #home {
        background-position: left center;
        padding: 75px 0px 75px 170px;  /* padding-top + padding-bottom + text area = image height */
        margin: -90px 0px 0px -198px;  /* offset vertical: half of image height */
                                       /* offset horizontal: half of image width and text area width */
    }
}

#menu {
    display: block;
    width: 100%;
    text-align: center;
}

</style>
