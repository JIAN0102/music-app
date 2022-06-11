<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['userLoggedIn']),
  },
  methods: {
    ...mapActions(['LOGOUT']),
    ...mapMutations(['TOGGLE_AUTH_MODAL']),
  },
};
</script>

<template>
  <header
    id="header"
    class="bg-gray-700"
  >
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <a
        class="text-white font-bold uppercase text-2xl mr-4"
        href="#"
      >Music</a>
      <div class="flex flex-grow items-center">
        <ul class="flex flex-row mt-1">
          <li v-if="!userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="TOGGLE_AUTH_MODAL"
            >
              Login / Register
            </a>
          </li>
          <template v-else>
            <li>
              <a
                class="px-2 text-white"
                href="#"
              >
                Manage
              </a>
            </li>
            <li>
              <a
                class="px-2 text-white"
                href="#"
                @click.prevent="LOGOUT"
              >
                Logout
              </a>
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
