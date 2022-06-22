<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['isLoggedIn']),
    currentLocale() {
      return this.$i18n.locale === 'fr' ? 'English' : 'French';
    },
  },
  methods: {
    ...mapActions(['LOGOUT']),
    ...mapMutations(['TOGGLE_AUTH_MODAL']),
    logout() {
      this.LOGOUT();

      if (this.$route.meta.requiresAuth) {
        this.$router.push({
          name: 'home',
        });
      }
    },
    changeLocale() {
      this.$i18n.locale = this.$i18n.locale === 'fr' ? 'en' : 'fr';
    },
  },
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
          <li>
            <router-link
              class="px-2 text-white"
              :to="{ name: 'about' }"
            >
              {{ $t('menu.about') }}
            </router-link>
          </li>
          <li v-if="!isLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="TOGGLE_AUTH_MODAL"
            >
              {{ $t('menu.auth') }}
            </a>
          </li>
          <template v-else>
            <li>
              <router-link
                class="px-2 text-white"
                :to="{ name: 'manage' }"
              >
                {{ $t('menu.manage') }}
              </router-link>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="logout"
              >
                {{ $t('menu.logout') }}
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
