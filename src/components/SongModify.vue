<script>
import { songsCollection, storage } from '@/includes/firebase';

export default {
  name: 'SongModify',
  props: {
    song: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  emits: ['edit-song', 'delete-song', 'update-unsaved-flag'],
  data() {
    return {
      showEditForm: false,
      schema: {
        modifiedName: 'required',
        genre: 'alpha_spaces',
      },
      editSongInSubmission: false,
      editSongShowAlert: false,
      editSongAlertVariant: 'bg-blue-500',
      editSongAlertMessage: 'Please wait! Updating song info.',
    };
  },
  methods: {
    async editSong(values) {
      this.editSongInSubmission = true;
      this.editSongShowAlert = true;
      this.editSongAlertVariant = 'bg-blue-500';
      this.editSongAlertMessage = 'Please wait! Updating song info.';

      try {
        await songsCollection.doc(this.song.docID).update(values);
      } catch (error) {
        this.editSongInSubmission = false;
        this.editSongAlertVariant = 'bg-red-500';
        this.editSongAlertMessage = 'Something went wrong! Try again later.';
        return;
      }

      this.$emit('edit-song', this.index, values);
      this.$emit('update-unsaved-flag', false);

      this.editSongInSubmission = false;
      this.editSongAlertVariant = 'bg-green-500';
      this.editSongAlertMessage = 'Success!';
    },
    async deleteSong() {
      const storageRef = storage.ref();
      const songRef = storageRef.child(`songs/${this.song.originalName}`);

      await songRef.delete();

      await songsCollection.doc(this.song.docID).delete();

      this.$emit('delete-song', this.index);
    },
    cancelEditSong() {
      this.showEditForm = false;
      this.$emit('update-unsaved-flag', false);
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
        @click.prevent="deleteSong"
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
      <div
        v-if="editSongShowAlert"
        class="mb-4 p-5 font-bold text-white text-center"
        :class="editSongAlertVariant"
      >
        {{ editSongAlertMessage }}
      </div>
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
            @input="$emit('update-unsaved-flag', true)"
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
            @input="$emit('update-unsaved-flag', true)"
          />
          <ErrorMessage
            class="text-red-600"
            name="genre"
          />
        </div>
        <button
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="editSongInSubmission"
        >
          Submit
        </button>
        <button
          type="button"
          class="ml-2 py-1.5 px-3 rounded text-white bg-gray-600"
          @click.prevent="cancelEditSong"
        >
          Go Back
        </button>
      </VForm>
    </div>
  </div>
</template>
