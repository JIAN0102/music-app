<script>
import { mapState } from 'vuex';
import { auth, songsCollection, commentsCollection } from '@/includes/firebase';

export default ({
  name: 'SongView',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      comments: [],
      commentInSubmission: false,
      commentShowAlert: false,
      commentAlertVariant: 'bg-blue-500',
      commentAlertMessage: 'Please wait! Your comment is being submitted.',
      sortType: '1',
    };
  },
  computed: {
    ...mapState(['isLoggedIn']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sortType === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const snapshop = await songsCollection.doc(this.$route.params.id).get();

    if (!snapshop.exists) {
      this.$router.push({ name: 'home' });
      return;
    }

    this.song = snapshop.data();
    this.getComments();
  },
  methods: {
    async sendComment(values, { resetForm }) {
      this.commentInSubmission = true;
      this.commentShowAlert = true;
      this.commentAlertVariant = 'bg-blue-500';
      this.commentAlertMessage = 'Please wait! Your comment is being submitted.';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        songID: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      await commentsCollection.add(comment);

      this.getComments();

      this.commentInSubmission = false;
      this.commentAlertVariant = 'bg-green-500';
      this.commentAlertMessage = 'Comment added!';

      resetForm();
    },
    async getComments() {
      const snapshots = await commentsCollection.where('songID', '==', this.$route.params.id).get();

      this.comments = [];

      snapshots.forEach((document) => {
        this.comments.push({
          docID: document.id,
          ...document.data(),
        });
      });
    },
  },
});
</script>

<template>
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div
      class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)"
    />
    <div class="container mx-auto flex items-center">
      <button
        type="button"
        class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
      >
        <i class="fas fa-play" />
      </button>
      <div class="z-50 text-left ml-8">
        <div class="text-3xl font-bold">
          {{ song.modifiedName }}
        </div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <span class="card-title">Comments (15)</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl" />
      </div>
      <div class="p-6">
        <div
          v-if="commentShowAlert"
          class="mb-4 p-5 font-bold text-white text-center"
          :class="commentAlertVariant"
        >
          {{ commentAlertMessage }}
        </div>
        <VForm
          v-if="isLoggedIn"
          :validation-schema="schema"
          @submit="sendComment"
        >
          <VField
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
            as="textarea"
            name="comment"
          />
          <ErrorMessage
            class="text-red-600"
            name="comment"
          />
          <button
            type="submit"
            class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="commentInSubmission"
          >
            Submit
          </button>
        </VForm>
        <select
          v-model="sortType"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        >
          <option value="1">
            Latest
          </option>
          <option value="2">
            Oldest
          </option>
        </select>
      </div>
    </div>
  </section>
  <ul class="container mx-auto">
    <li
      v-for="comment in sortedComments"
      :key="comment.docID"
      class="p-6 bg-gray-50 border border-gray-200"
    >
      <div class="mb-5">
        <div class="font-bold">
          {{ comment.name }}
        </div>
        <div>{{ comment.datePosted }}</div>
      </div>
      <p>{{ comment.content }}</p>
    </li>
  </ul>
</template>
