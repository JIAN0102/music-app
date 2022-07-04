<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/AppHeader.vue';
import PlayerBar from '@/components/PlayerBar.vue';
import AuthModal from '@/components/AuthModal.vue';

const authStore = useAuthStore();
const { initLogin } = authStore;

onMounted(() => {
  initLogin();
});
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
