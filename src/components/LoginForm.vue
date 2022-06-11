<script>
import { mapActions } from 'vuex';

export default {
  name: 'LoginForm',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:6|max:32',
      },
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: 'bg-blue-500',
      loginAlertMessage: 'Please wait! You are logging you in.',
    };
  },
  methods: {
    ...mapActions(['LOGIN']),
    async login(values) {
      this.loginShowAlert = true;
      this.loginInSubmission = true;
      this.loginAlertVariant = 'bg-blue-500';
      this.loginAlertMessage = 'Please wait! You are logging you in.';

      try {
        await this.LOGIN(values);
      } catch (error) {
        this.loginInSubmission = false;
        this.loginAlertVariant = 'bg-red-500';
        this.loginAlertMessage = 'Invalid login details.';
        return;
      }

      this.loginAlertVariant = 'bg-green-500';
      this.loginAlertMessage = 'Success! You are now logged in.';
      window.location.reload();
    },
  },
};
</script>

<template>
  <div
    v-if="loginShowAlert"
    class="mb-4 p-5 font-bold text-white text-center"
    :class="loginAlertVariant"
  >
    {{ loginAlertMessage }}
  </div>
  <VForm
    :validation-schema="loginSchema"
    @submit="login"
  >
    <div class="mb-3">
      <label
        class="block"
        for="loginEmail"
      >
        Email
      </label>
      <VField
        id="loginEmail"
        class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        type="email"
        name="email"
        placeholder="Enter Email"
      />
      <ErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>
    <div class="mb-3">
      <label
        class="block"
        for="loginPassword"
      >
        Password
      </label>
      <VField
        id="loginPassword"
        class="block w-full py-1.5 px-3 mt-2 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        type="password"
        name="password"
        placeholder="Password"
        autocomplete="off"
      />
      <ErrorMessage
        class="text-red-600"
        name="password"
      />
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loginInSubmission"
    >
      Submit
    </button>
  </VForm>
</template>
