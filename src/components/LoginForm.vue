<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { login } = authStore;

const loginSchema = reactive({
  email: 'required|email',
  password: 'required|min:6|max:32',
});
const loginInSubmission = ref(false);
const loginShowAlert = ref(false);
const loginAlertVariant = ref('bg-blue-500');
const loginAlertMessage = ref('Please wait! You are logging you in.');

const userLogin = async (values) => {
  loginInSubmission.value = true;
  loginShowAlert.value = true;
  loginAlertVariant.value = 'bg-blue-500';
  loginAlertMessage.value = 'Please wait! You are logging you in.';

  try {
    await login(values);
  } catch (error) {
    loginInSubmission.value = false;
    loginAlertVariant.value = 'bg-red-500';
    loginAlertMessage.value = 'Invalid login details.';
    return;
  }

  loginAlertVariant.value = 'bg-green-500';
  loginAlertMessage.value = 'Success! You are now logged in.';
  window.location.reload();
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
    @submit="userLogin"
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
