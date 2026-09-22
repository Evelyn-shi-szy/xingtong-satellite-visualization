<template>
  <div id="app">
    <div class="space-bg" aria-hidden="true"></div>
    <app-header />
    <main class="page-shell">
      <router-view />
    </main>
    <app-footer />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: { AppHeader, AppFooter }
}
</script>