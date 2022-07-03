<script setup>
import {
  ref, reactive, computed, watch, onMounted,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { auth, songsCollection, commentsCollection } from '@/includes/firebase';

const route = useRoute();
const router = useRouter();

const store = useStore();

const { t, n } = useI18n();

const song = ref({});
const schema = reactive({
  comment: 'required|min:3',
});
const comments = ref([]);
const commentInSubmission = ref(false);
const commentShowAlert = ref(false);
const commentAlertVariant = ref('bg-blue-500');
const commentAlertMessage = ref('Please wait! Your comment is being submitted.');
const sort = ref('1');

const isLoggedIn = computed(() => store.state.isLoggedIn);
const currentSong = computed(() => store.state.currentSong);
const isSongPlaying = computed(() => store.getters.isSongPlaying);
const setSong = (payload) => store.dispatch('SET_SONG', payload);

const sortedComments = computed(() => comments.value.slice().sort((a, b) => {
  if (sort.value === '1') {
    return new Date(b.datePosted) - new Date(a.datePosted);
  }
  return new Date(a.datePosted) - new Date(b.datePosted);
}));

watch(sort, (newVal) => {
  if (newVal === route.query.sort) {
    return;
  }

  router.push({
    query: { sort: newVal },
  });
});

const getComments = async () => {
  const snapshots = await commentsCollection.where('songID', '==', route.params.id).get();

  comments.value = [];

  snapshots.forEach((document) => {
    comments.value.push({
      docID: document.id,
      ...document.data(),
    });
  });
};

onMounted(async () => {
  const snapshop = await songsCollection.doc(route.params.id).get();

  if (!snapshop.exists) {
    router.push({
      name: 'home',
    });
    return;
  }

  const { nowSort } = route.query;

  sort.value = nowSort === '1' || nowSort === '2' ? nowSort : '1';

  song.value = snapshop.data();
  getComments();
});

const sendComment = async (values, { resetForm }) => {
  commentInSubmission.value = true;
  commentShowAlert.value = true;
  commentAlertVariant.value = 'bg-blue-500';
  commentAlertMessage.value = 'Please wait! Your comment is being submitted.';

  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    songID: route.params.id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid,
  };

  await commentsCollection.add(comment);

  song.commentCount += 1;
  await songsCollection.doc(route.params.id).update({
    commentCount: song.value.commentCount,
  });

  getComments();

  commentInSubmission.value = false;
  commentAlertVariant.value = 'bg-green-500';
  commentAlertMessage.value = 'Comment added!';

  resetForm();
};
</script>

<template>
  <main>
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      />
      <div class="relative container mx-auto flex items-center">
        <button
          type="button"
          class="h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
          :class="{ 'animate-spin': isSongPlaying && song.url === currentSong.url }"
          @click.prevent="setSong(song)"
        >
          <i class="fas fa-play" />
        </button>
        <div class="text-left ml-8">
          <div class="text-3xl font-bold">
            {{ song.modifiedName }}
          </div>
          <div>{{ song.genre }}</div>
          <div class="song-price">
            {{ n(1, 'currency', 'ja') }}
          </div>
        </div>
      </div>
    </section>

    <section
      id="comments"
      class="container mx-auto mt-6"
    >
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title">
            {{ t('song.comment_count', song.commentCount, {
              count: song.commentCount
            }) }}
          </span>
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
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
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
            v-model="sort"
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
  </main>
</template>
