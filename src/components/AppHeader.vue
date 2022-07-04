<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);
const { logout, toggleAuthModal } = authStore;

const { t, locale } = useI18n();

const currentLocale = computed(() => (locale.value === 'fr' ? 'English' : 'French'));

const userLogout = () => {
  logout();

  if (route.meta.requiresAuth) {
    router.push({
      name: 'home',
    });
  }
};

const changeLocale = () => {
  locale.value = locale.value === 'fr' ? 'en' : 'fr';
};
</script>

<template>
  <header
    id="header"
    class="bg-gray-700"
  >
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <router-link
        class="text-white font-bold uppercase text-2xl mr-4"
        :to="{ name: 'home' }"
        exact-active-class="no-active"
      >
        Music
      </router-link>
      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li v-if="!isLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              {{ t('menu.auth') }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{ name: 'manage' }"
              >
                {{ t('menu.manage') }}
              </router-link>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="userLogout"
              >
                {{ t('menu.logout') }}
              </a>
            </li>
          </template>
        </ul>
        <ul class="flex flex-row mt-1 ml-auto">
          <li>
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="changeLocale"
            >{{ currentLocale }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
