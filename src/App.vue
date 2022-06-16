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

  <router-view v-slot="{ Component }">
    <transition
      name="fade"
      mode="out-in"
    >
      <component :is="Component" />
    </transition>
  </router-view>

  <PlayerBar />

  <AuthModal />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all .5s linear;
}

.fade-leave-to {
  transition: all .5s linear;
  opacity: 0;
}
</style>
