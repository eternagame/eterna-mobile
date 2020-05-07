<template>
    <b-form id="home-container">
        <div class="logo" />
        <b-form-input type="text" :disabled="isLoading" v-model="username" placeholder="username"></b-form-input>
        <b-form-input type="password" :disabled="isLoading" v-model="password" placeholder="password"></b-form-input>
        <b-form-group>
            <router-link to="reset-password">Forgot your password?</router-link>
        </b-form-group>
        <b-button variant="primary" :disabled="isLoading" size="lg" v-on:click="doLogin">Enter</b-button>
        <b-form-group>
            <router-link to="register">Register</router-link>
        </b-form-group>
    </b-form>
</template>

<script lang="ts">
import Vue from 'vue';
import router from '../router';
import { Action } from '../store';

export default Vue.extend({
    data() {
        return {
            username: '',
            password: '',
        };
    },
    computed: {
        isLoading(): boolean {
            return this.$store.state.isLoading;
        },
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        }
    },
    methods: {
        doLogin() {
            if (this.username.length > 0 && this.password.length > 0) {
                this.$store.dispatch(Action.LOGIN, {username: this.username, password: this.password})
                    .then(() => {
                        if (this.loggedIn) {
                            this.$router.push('puzzles');
                        }
                    });
            }
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

.logo {
    background: url('../assets/logo_eterna.svg') no-repeat center top; /* 170px x 200px */
    height: 15vmin;                   /* text area height */
    // margin-top: 10vmin;
    margin-bottom: 10vmin;
}

#home-container {
    width: 100vw;
    text-align: center;
    padding-top: 10vh !important;
}

.form-control {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80vw;
    max-width: 300px;
}
</style>
