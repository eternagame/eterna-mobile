<template>
  <section id="profile-page">
    <HeaderBar class="header-bar"></HeaderBar>
    <div class="content">
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
          <b-container id="puzzle-scroll">
            <ul id="puzzle-card-wrapper">
              <li v-for="item in achievements" :key="item.title" class="achievement-card">
                <img :src="item.image" :alt="item.desc"/>
                <h3 class="achievement-title">{{item.title}}</h3>
              </li>
            </ul>
          </b-container>
      </div>
    </div>
    <NavBar class="nav-bar"></NavBar>
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
      username(): string {
        return this.$store.state?.username;
      },
      avatarUrl(): string {
        const condition = this.$store.state.user && this.$store.state.user.picture !== "";
        return condition ? this.$store.state.user.picture : "../assets/user.svg";
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
        return this.$store.state.user ? Object.values(this.$store.state.user.achievements) : [];
      },
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

.content {
  display: flex;
}

.user-data {
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  overflow: hidden;
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

  #puzzle-scroll {
    padding-left: 0;
  }

  #puzzle-card-wrapper {
    padding: 0;
    margin: 0;
  }
}

.achievement-card {
  list-style: none;
  padding: 0;
  display: inline-flex;
  flex-direction: column;
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