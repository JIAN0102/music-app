<script>
import { mapActions } from 'vuex';
import AppHeader from '@/components/AppHeader.vue';
import PlayerBar from '@/components/PlayerBar.vue';
import AuthModal from '@/components/AuthModal.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    PlayerBar,
    AuthModal,
  },
  created() {
    this.INIT_LOGIN();
  },
  methods: {
    ...mapActions(['INIT_LOGIN']),
  },
};
</script>

<template>
  <AppHeader />

  <router-view />

  <PlayerBar />

  <AuthModal />
</template>
