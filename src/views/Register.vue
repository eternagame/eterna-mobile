<template>
    <b-container id="register-container">
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

<style scoped lang="scss">
#register-container {
    width: 80%;
    text-align: center;
}
</style>
