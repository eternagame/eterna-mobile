<template>
    <b-form id="login-container">
        <a class="close-button" @click="back"></a>
        <div class="logo" />
        <b-form-input type="text" size="md" :disabled="isLoading" v-model="username" placeholder="username"></b-form-input>
        <b-form-input type="password" size="md" :disabled="isLoading" v-model="password" placeholder="password"></b-form-input>
        <div class="alert-container">
            <b-alert v-model="showError" variant="danger" dismissable>
                {{error}}
            </b-alert>
        </div>
        <b-form-group>
            <router-link to="/reset-password">Forgot your password?</router-link>
        </b-form-group>
        <b-form-group>
            <b-button variant="primary" :disabled="isLoading" size="md" @click="doLogin">Enter</b-button>
        </b-form-group>
        <b-form-group>
            <router-link to="/register">Register</router-link>
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
                        this.$router.replace('/home');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    // TODO: Is this necessarily a string?
                    this.error = error as string;
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
    margin-bottom: 10vmin;
}

#login-container {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    text-align: center;
    padding-top: 10vh !important;
}
#login-container::-webkit-scrollbar {
    display: none;
}

.form-control {
    margin: 0 auto;
    margin-bottom: 10px;
    width: 80vw;
    max-width: 300px;
}
</style>
