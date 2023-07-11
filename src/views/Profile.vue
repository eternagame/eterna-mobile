<template>
  <section id="profile-page">
    <HeaderBar class="header-bar"></HeaderBar>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="page-content">
      <div class="user-data">
        <div class="user-avatar">
          <img :src="avatarUrl" alt="Profile Picture" class="r">
        </div>
        <h2 class="user-username">{{username}}</h2>
        <ul class="user-stats">
          <li class="user-stat">
            {{points}}
            <span>Points</span>
          </li>
          <li class="user-stat">
            {{rank}}
            <span>Rank</span>
          </li>
          <li class="user-stat">
            {{synthesized}}
            <span style="align-self: flex-start">Synthesized</span>
          </li>
        </ul>
      </div>
      <div class="user-achievements">
        <h1>Achievements</h1>
          <b-container id="page-scroll-content">
            <ul id="scroll-card-wrapper">
              <li v-for="item in achievements" :key="`${item.title} (${item.level})`" class="achievement-card">
                <img :src="resolveUrl(item.image)" :alt="item.desc"/>
                <h3 class="achievement-title">{{item.title}}</h3>
              </li>
            </ul>
          </b-container>
      </div>
    </div>
    <NavBar class="nav-bar">
      <template v-slot:left>
        <button @click="$router.go(-1)" class="back-button">
          <svg viewBox="0 0 24 24" class="feather feather-arrow-left-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 8 8 12 12 16"></polyline>
            <line x1="16" y1="12" x2="8" y2="12"></line>
          </svg>
        </button>
      </template>
      <template v-if="!lab_access" v-slot:center>
        <b-button variant="primary" size="lg" class="nav-button" id="home-btn" @click="$router.push('/')">
          <div class="home-disabled"></div>
          Home
        </b-button>
      </template>
      <template v-slot:right><div></div></template>
    </NavBar>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import HeaderBar from '../components/HeaderBar.vue'
import NavBar from '../components/NavBar.vue'

export default Vue.extend({
    data() {
      return {};
    },
    computed: {
      isLoading(): boolean {
        return this.$store.getters.isLoading;
      },
      username(): string {
        return this.$store.state?.username;
      },
      avatarUrl(): string {
        const condition = this.$store.state.user && this.$store.state.user.picture !== "";
        return condition ? this.resolveUrl(this.$store.state.user.picture) : "../assets/user.svg";
      },
      points(): string {
        return this.$store.state.user ? this.$store.state.user.points : "0";
      },
      rank(): number {
        return this.$store.state.user ? this.$store.state.user.rank : 0;
      },
      synthesized(): number {
        return this.$store.state.user ? this.$store.state.user.synthesized_count : 0;
      },
      achievements() {
        return this.$store.state.user ? Object.values(this.$store.state.user.achievements).reverse() : [];
      },
      lab_access() {
        return this.$store.state.user.lab_access;
      }
    },
    methods: {
      resolveUrl(path: string) {
        if (path.startsWith('http')) return path;
        if (path.startsWith('/')) return process.env.APP_SERVER_URL + path;
        return process.env.APP_SERVER_URL + '/' + path;
      }
    },
    components: {
      HeaderBar,
      NavBar
    },
    created() {
      this.$store.dispatch('GET_PROFILE', {id: this.$store.state.uid})
    }
})

</script>

<style lang="scss" scoped>
#profile-page {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.user-data {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  overflow: auto;
}

.user-avatar {
  width: 25vmin;
  height: 25vmin;
  background-color: var(--light-blue);

  img {
    width: 100%;
    object-fit: cover;
  }
}

h1, h2 {
  font-size: 2rem;
}

.user-username {
  font-size: 1.5rem;
  margin: 16px 0;
}

.user-stats {
  list-style: none;
  display: flex;
  justify-content: space-between;
  padding: 0;
  width: 100%;
}

.user-stat {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
  overflow: hidden;
  text-overflow: ellipsis;

  span {
    width: 100%;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 0.7rem;
    align-self: flex-start;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.user-achievements {
  width: 60%;
  height: 100%;

  #page-scroll-content {
    padding-left: 0;
  }

  #scroll-card-wrapper {
    padding: 0;
    margin: 0;
  }
}

.achievement-card {
  list-style: none;
  padding: 0;
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  height: 100%;
  width: 45vmin;
  height: 45vmin;
  border-radius: 2vmin;
  background-color: #008cff15;
  scroll-snap-align: center;
  text-align: center;
  margin-top: 3vmin;
  margin-bottom: 3vmin;
  margin-left: 1vmin;
  margin-right: 1vmin;
  padding: 8px;
  border: solid;
  border-color: #21508C;

  img {
    height: 80%;
    object-fit: contain;
  }

  h3 {
    font-size: 1rem;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin: 0;
  }
}
</style>