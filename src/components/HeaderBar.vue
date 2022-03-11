<template>
  <header>
    <b-img class="header-logo" :src="logoSourcePng" />
    <div v-if="loggedIn" class="account-dropdown">
      <b-dropdown right variant="link" toggle-class="text-decoration-none puzzle-view-button" menu-class="puzzle-view-button" no-caret>
        <template #button-content>
            <b style="line-height:6vmin;margin-right:2vmin;vertical-align:bottom;">{{ username }}</b>
            <div class="puzzle-view-icon-people" />
        </template>
        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
      </b-dropdown>
    </div>
    <div v-else class="login-buttons">
      <b-button class="puzzle-view-button" variant="primary" style="margin-right:3vmin" to="login">Log in</b-button>
      <b-button class="puzzle-view-button" variant="secondary" to="register">Register</b-button>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import { Action } from '../store';

export default Vue.extend({
  props: {
  },
  data() {
    return {
      logoSourcePng: require('../assets/logo_eterna.svg'),
    }
  },
  computed: {
    loggedIn(): boolean {
      return this.$store.state.loggedIn;
    },
    username(): string {
      return this.$store.state.username;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch(Action.LOGOUT);
      this.$router.replace('/')
    },
  }
})
</script>

<style lang="scss" scoped>
  header {
    height: 18vh;
    width: 100%;
    padding-top: 3vmin;
    margin-left: 3vmin;
    margin-right: 3vmin;
    margin-bottom: 3vmin;
    display: flex;
    justify-content: space-between;
  }
</style>