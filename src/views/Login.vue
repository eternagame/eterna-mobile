<template>
    <b-form id="home-container">
        <b-button class="back-button" @click="back">Back</b-button>
        <div class="logo" />
        <b-form-input type="text" :disabled="isLoading" v-model="username" placeholder="username"></b-form-input>
        <b-form-input type="password" :disabled="isLoading" v-model="password" placeholder="password"></b-form-input>
        <b-form-group>
            <router-link to="reset-password">Forgot your password?</router-link>
        </b-form-group>
        <b-button variant="primary" :disabled="isLoading" size="lg" @click="doLogin">Enter</b-button>
        <b-form-group>
            <router-link to="register">Register</router-link>
        </b-form-group>
        <div class="alert-container">
            <b-alert v-model="showError" variant="danger" dismissable>
                {{error}}
            </b-alert>
        </div>
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
            error: <string | null>null,
            showError: false,
        };
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        },
    },
    methods: {
        async doLogin() {
            this.showError = false;
            if (this.username.length > 0 && this.password.length > 0) {
                try {
                    const data = await this.$store.dispatch(Action.LOGIN, {username: this.username, password: this.password});
                    if (data.error) {
                        console.error('Error:', data.error);
                        this.error = data.error;
                        this.showError = true;
                    }
                    if (this.loggedIn) {
                        this.$router.replace('puzzles');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    this.error = error;
                    this.showError = true;
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

.alert-container {
    width: 80vw;
    max-width: 300px;
    margin: 0 auto;
}

.back-button {
    position: absolute;
    left: 10px;
    top: 10px;
}
</style>
