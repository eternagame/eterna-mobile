<template>
    <b-container>
        <b-form>
            <div class="logo"></div>
            <b-form-input type="text" v-model="username" placeholder="username"></b-form-input>
            <b-form-input type="password" v-model="password" placeholder="password"></b-form-input>
            <b-form-group>
                <router-link to="reset-password">Forgot your password?</router-link>
            </b-form-group>
            <b-button variant="primary" size="lg" v-on:click="login">Enter</b-button>
            <b-form-group>
                <router-link to="register">Register</router-link>
            </b-form-group>
        </b-form>
        <div id="deviceready" class="blink">
            <p class="event listening">Connecting to Device</p>
            <p class="event received">Device is Ready</p>   
        </div>
    </b-container>
<!-- <div id="home">
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
</div> -->
</template>

<script lang="ts">
import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue'

import router from '../router';

Vue.use(BootstrapVue);

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id: string) {
        var parentElement = document.getElementById(id);
        if (!parentElement) {
            console.log('No parent element');
        }
        var listeningElement = parentElement?.querySelector('.listening');
        var receivedElement = parentElement?.querySelector('.received');

        listeningElement?.setAttribute('style', 'display:none;');
        receivedElement?.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

export default Vue.extend({
    data() {
        return {
            title: 'ETERNA MOBILE',
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
@import 'src/styles/global.scss';

@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

@import 'src/styles/_bootswatch.scss';
@import 'src/styles/custom.scss';

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

.event {
    border-radius: 4px;
    -webkit-border-radius: 4px;
    color: #FFFFFF;
    font-size: 12px;
    margin: 0px 30px;
    padding: 2px 0px;
}

.event.listening {
    background-color: #333333;
    display: block;
}

.event.received {
    background-color: #4B946A;
    display: none;
}

@keyframes fade {
    from { opacity: 1.0; }
    50% { opacity: 0.4; }
    to { opacity: 1.0; }
}

@-webkit-keyframes fade {
    from { opacity: 1.0; }
    50% { opacity: 0.4; }
    to { opacity: 1.0; }
}

#deviceready {
    margin-top: 20px;
}

.blink {
    animation: fade 3000ms infinite;
    -webkit-animation: fade 3000ms infinite;
}

.logo {
    background: url('../assets/logo_eterna.svg') no-repeat center top; /* 170px x 200px */
    height: 170px;                   /* text area height */
    width: 200px;                   /* text area width */
    margin-top: 100px;
}

.container {
    width: 80%;
}

// #menu {
//     display: block;
//     width: 100%;
//     text-align: center;
// }

.form-control {
    margin-bottom: 10px;
}
</style>
