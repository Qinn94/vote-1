<template>
  <div class="app">
    <!-- <Home></Home> -->
    <!-- <router-link to="/">Home</router-link> | -->
    <!-- <router-link to="/about">About</router-link> -->
    <router-view />
  </div>
</template>

<script>
import Home from "./views/Home.vue";

export default {
  components: {
    Home,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

.app {
  background-color: #1a1d80;
}
</style>
