<template>
  <div
    v-if="registrationShowAlert"
    class="mb-4 p-5 font-bold text-white text-center"
    :class="registrationAlertVariant"
  >
    {{ registrationAlertMessage }}
  </div>
  <VForm
    :validation-schema="registerSchema"
    :initial-values="userData"
    @submit="register"
  >
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerName"
      >
        Name
      </label>
      <VField
        id="registerName"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="name"
        type="text"
        placeholder="Enter Name"
      />
      <ErrorMessage
        class="text-red-600"
        name="name"
      />
    </div>
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerEmail"
      >
        Email
      </label>
      <VField
        id="registerEmail"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="email"
        type="email"
        placeholder="Enter Email"
      />
      <ErrorMessage
        class="text-red-600"
        name="email"
      />
    </div>
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerAge"
      >
        Age
      </label>
      <VField
        id="registerAge"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        name="age"
        type="number"
      />
      <ErrorMessage
        class="text-red-600"
        name="age"
      />
    </div>
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerPassword"
      >
        Password
      </label>
      <VField
        v-slot="{ field, errors }"
        name="password"
        :bails="false"
      >
        <input
          id="registerPassword"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          type="password"
          placeholder="Password"
          autocomplete="off"
          v-bind="field"
        >
        <div
          v-for="error in errors"
          :key="error"
          class="text-red-600"
        >
          {{ error }}
        </div>
      </VField>
    </div>
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerConfirmPassword"
      >
        Confirm Password
      </label>
      <VField
        id="registerConfirmPassword"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        autocomplete="off"
      />
      <ErrorMessage
        class="text-red-600"
        name="confirmPassword"
      />
    </div>
    <div class="mb-3">
      <label
        class="inline-block mb-2"
        for="registerCountry"
      >
        Country
      </label>
      <VField
        id="registerCountry"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        as="select"
        name="country"
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
        <option value="Antarctica">
          Antarctica
        </option>
      </VField>
      <ErrorMessage
        class="text-red-600"
        name="country"
      />
    </div>
    <div class="mb-3 pl-6">
      <VField
        id="acceptTerms"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
        type="checkbox"
        name="tos"
        value="1"
      />
      <label
        class="inline-block"
        for="acceptTerms"
      >
        Accept terms of service
      </label>
      <ErrorMessage
        class="block text-red-600"
        name="tos"
      />
    </div>
    <button
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      type="submit"
      :disabled="registrationInSubmission"
    >
      Submit
    </button>
  </VForm>
</template>

<script>
export default {
  name: 'RegisterForm',
  data() {
    return {
      registerSchema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:3|max:32',
        confirmPassword: 'password_mismatch:@password',
        country: 'required|country_excluded:Antarctica',
        tos: 'tos',
      },
      userData: {
        country: 'USA',
      },
      registrationInSubmission: false,
      registrationShowAlert: false,
      registrationAlertVariant: 'bg-blue-500',
      registrationAlertMessage: 'Please wait! Your account is being created.',
    };
  },
  methods: {
    register(values) {
      this.registrationShowAlert = true;
      this.registrationInSubmission = true;
      this.registrationAlertVariant = 'bg-blue-500';
      this.registrationAlertMessage = 'Please wait! Your account is being created.';

      this.registrationAlertVariant = 'bg-green-500';
      this.registrationAlertMessage = 'Success! Your account has being created.';
      console.log(values);
    },
  },
};
</script>
