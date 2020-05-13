<template>
    <b-container id="reset-password-container">
        <b-button class="back-button" @click="back">Back</b-button>
        <h3>Reset password</h3>
        <p>We'll send you an email with a link to reset your password</p>
        <b-form>
            <b-form-input type="email" placeholder="email"></b-form-input>
            <b-btn variant="primary">Send Reset Email</b-btn>
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
#reset-password-container {
    width: 100vw;
    text-align: center;
    padding-top: 25vh !important;
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
