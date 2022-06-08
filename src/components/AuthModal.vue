<template>
  <div
    id="modal"
    class="fixed z-10 inset-0 overflow-y-auto "
    :class="{ hidden: !authModalShow }"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 transition-opacity bg-gray-800 opacity-75">
        <div class="absolute inset-0 bg-gray-800 opacity-75" />
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="py-4 text-left px-6">
          <div class="flex justify-between items-center pb-4">
            <p class="text-2xl font-bold">
              Your Account
            </p>
            <button
              type="button"
              class="modal-close cursor-pointer z-50"
              @click.prevent="TOGGLE_AUTH_MODAL"
            >
              <i class="fas fa-times" />
            </button>
          </div>
          <ul class="flex flex-wrap mb-4">
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': authType === 'login',
                  'hover:text-blue-600': authType !== 'login'
                }"
                href="#"
                @click.prevent="authType = 'login'"
              >Login</a>
            </li>
            <li class="flex-auto text-center">
              <a
                class="block rounded py-3 px-4 transition"
                :class="{
                  'hover:text-white text-white bg-blue-600': authType === 'register',
                  'hover:text-blue-600': authType !== 'register'
                }"
                href="#"
                @click.prevent="authType = 'register'"
              >Register</a>
            </li>
          </ul>
          <form v-show="authType === 'login'">
            <div class="mb-3">
              <label
                class="block"
                for="loginEmail"
              >
                Email
                <input
                  id="loginEmail"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                  type="email"
                  placeholder="Enter Email"
                >
              </label>
            </div>
            <div class="mb-3">
              <label
                class="block"
                for="loginPassword"
              >
                Password
                <input
                  id="loginPassword"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                  type="password"
                  placeholder="Password"
                >
              </label>
            </div>
            <button
              type="submit"
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            >
              Submit
            </button>
          </form>
          <form v-show="authType === 'register'">
            <div class="mb-3">
              <label
                class="block"
                for="registerName"
              >
                Name
                <input
                  id="registerName"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                  type="text"
                  placeholder="Enter Name"
                >
              </label>
            </div>
            <div class="mb-3">
              <label
                class="block"
                for="registerEmail"
              >
                Email
                <input
                  id="registerEmail"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                  type="email"
                  placeholder="Enter Email"
                >
              </label>
            </div>
            <div class="mb-3">
              <label
                class="block"
                for="registerAge"
              >
                Age
                <input
                  id="registerAge"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                  type="number"
                >
              </label>
            </div>
            <div class="mb-3">
              <label
                class="block"
                for="registerPassword"
              >
                Password
                <input
                  id="registerPassword"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                  type="password"
                  placeholder="Password"
                >
              </label>
            </div>
            <div class="mb-3">
              <label
                class="block"
                for="registerConfirmPassword"
              >
                Confirm Password
                <input
                  id="registerConfirmPassword"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                  type="password"
                  placeholder="Confirm Password"
                >
              </label>
            </div>
            <div class="mb-3">
              <label
                class="block"
                for="registerCountry"
              >
                Country
                <select
                  id="registerCountry"
                  class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                >
                  <option value="USA">
                    USA
                  </option>
                  <option value="Mexico">
                    Mexico
                  </option>
                  <option value="Germany">
                    Germany
                  </option>
                </select>
              </label>
            </div>
            <div class="mb-3 pl-6">
              <label
                class="inline-block"
                for="acceptTerms"
              >
                <input
                  id="acceptTerms"
                  class="w-4 h-4 float-left -ml-6 mt-1 rounded"
                  type="checkbox"
                >
                Accept terms of service
              </label>
            </div>
            <button
              class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'AuthModal',
  data() {
    return {
      authType: 'login',
    };
  },
  computed: {
    ...mapState(['authModalShow']),
    // ...mapState({
    //   modal: 'authModalShow',
    // }),
  },
  methods: {
    ...mapMutations(['TOGGLE_AUTH_MODAL']),
  },
};
</script>
