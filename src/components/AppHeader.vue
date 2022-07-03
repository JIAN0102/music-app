<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();

const store = useStore();

const { t, locale } = useI18n();

const isLoggedIn = computed(() => store.state.isLoggedIn);

const currentLocale = computed(() => (locale.value === 'fr' ? 'English' : 'French'));

const LOGOUT = () => {
  store.dispatch('LOGOUT');
};

const TOGGLE_AUTH_MODAL = () => {
  store.commit('TOGGLE_AUTH_MODAL');
};

const logout = () => {
  LOGOUT();

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
              @click.prevent="TOGGLE_AUTH_MODAL"
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
                @click.prevent="logout"
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
