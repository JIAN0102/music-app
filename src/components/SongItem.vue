<script>
export default {
  name: 'SongList',
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditForm: false,
      schema: {
        modifiedName: 'required',
        genre: 'alpha_spaces',
      },
      editSongInSubmission: false,
    };
  },
  methods: {
    editSong() {
      console.log('Song edited');
    },
  },
};
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showEditForm">
      <h4 class="inline-block text-2xl font-bold">
        {{ song.modifiedName }}
      </h4>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times" />
      </button>
      <button
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showEditForm = !showEditForm"
      >
        <i class="fa fa-pencil-alt" />
      </button>
    </div>
    <div v-show="showEditForm">
      <VForm
        :validation-schema="schema"
        :initial-values="song"
        @submit="editSong"
      >
        <div class="mb-3">
          <label
            class="inline-block mb-2"
            for="songTitle"
          >Song Title</label>
          <VField
            id="songTitle"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 first-line:transition duration-500 focus:outline-none focus:border-black rounded"
            type="text"
            name="modifiedName"
            placeholder="Enter Song Title"
          />
          <ErrorMessage
            class="text-red-600"
            name="modifiedName"
          />
        </div>
        <div class="mb-3">
          <label
            class="inline-block mb-2"
            for="genre"
          >Genre</label>
          <VField
            id="genre"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            type="text"
            name="genre"
            placeholder="Enter Genre"
          />
          <ErrorMessage
            class="text-red-600"
            name="genre"
          />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          type="button"
          class="ml-2 py-1.5 px-3 rounded text-white bg-gray-600"
          @click="showEditForm = false"
        >
          Go Back
        </button>
      </VForm>
    </div>
  </div>
</template>
