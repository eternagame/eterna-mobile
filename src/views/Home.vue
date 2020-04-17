<template>
<div id="home">
    <h1>{{ title }}</h1>
    <div id="menu">
        <input class="form-control" v-model="username" required="" type="username" placeholder="Username">
        <input class="form-control" v-model="password" required="" type="password" placeholder="Password">
        <button class="clickable-text" v-on:click="forgot">Forgot your password?</button>
        <button class="button-enter" v-on:click="login">ENTER</button>
        <button class="clickable-text" v-on:click="register">Register here</button>
    </div>
    <div id="deviceready" class="blink">
        <p class="event listening">Connecting to Device</p>
        <p class="event received">Device is Ready</p>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

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
    mounted() {
        app.initialize();
    },
    data() {
        return {
            title: 'Eterna Mobile',
            username: '',
            password: ''
        }
    },
    methods: {
        login() {
            console.log('login');
        },
        forgot() {
            console.log('forgot password');
        },
        register() {
            console.log('register')
        }
    }
});
</script>

<style lang="scss">
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

.blink {
    animation: fade 3000ms infinite;
    -webkit-animation: fade 3000ms infinite;
}

#menu {
    display: block;
}

.form-control {
    display: block;
    width: 100%;
    margin: 0.5rem 0rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #7b8a8b;
    background-color: #00000057;
    background-clip: padding-box;
    border: 1px solid #597ea2;
    border-radius: 0.25rem;
}

.button-enter {
    color: #fff;
    background-color: #53B64E;
    border-color: #53B64E;
    display: inline-block;
    width: 100%;
    margin: 0.5rem 0rem;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    border: 1px solid transparent;
    padding: 0.4rem 0.85rem;
    font-size: 0.9375rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, -webkit-box-shadow 0.15s ease-in-out;
}

.clickable-text {
    border: none;
    background: none;
    text-decoration: underline;
    color: white;
    padding: 0.1rem 0.85rem;
    margin: 0.5rem 0rem;
}

</style>
