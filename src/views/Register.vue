<template>
    <b-container id="register-container">
        <b-button class="back-button" @click="back">Back</b-button>
        <h3>Create a New Account</h3>
        <p>Register now to save your progress, engage in our community chat, and contribute solutions to science.</p>
        <b-form>
            <b-form-input type="text" placeholder="username" required></b-form-input>
            <b-form-input type="email" placeholder="email" required></b-form-input>
            <b-form-input type="password" placeholder="password" required></b-form-input>
            <b-form-input type="password" placeholder="re-enter password" required></b-form-input>
            <b-btn variant="primary">Create Account</b-btn>
            <b-form-group>
                <a href="https://eternagame.org/web/news/15121/" target="_blank">Terms &amp; Conditions</a>
            </b-form-group>
        </b-form>
    </b-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    methods: {
        back() {
            this.$router.back();
        },
    },
})
</script>

<style lang="scss" scoped>
#register-container {
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

.back-button {
    position: absolute;
    left: 10px;
    top: 10px;
}
</style>
