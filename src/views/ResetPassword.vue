<template>
    <b-container id="reset-password-container">
        <h3>Reset password</h3>
        <p>We'll send you an email with a link to reset your password</p>
        <b-form>
            <b-form-input type="email" placeholder="email"></b-form-input>
            <b-btn variant="primary">Send Reset Email</b-btn>
        </b-form>
    </b-container>
</template>

<style scoped lang="scss">
#reset-password-container {
    width: 80%;
    text-align: center;
    padding-top: 25vh;
}
</style>