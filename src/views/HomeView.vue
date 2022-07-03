<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { songsCollection } from '@/includes/firebase';
import SongItem from '@/components/SongItem.vue';
import vIconSecondary from '@/directives/vIconSecondary';

const songs = ref([]);
const maxPerLoad = ref(10);
const pendingRequest = ref(false);

const { t } = useI18n();

const getSongs = async () => {
  if (pendingRequest.value) {
    return;
  }

  pendingRequest.value = true;

  let snapshots = null;

  if (songs.value.length) {
    const lastDoc = await songsCollection
      .doc(songs.value[songs.value.length - 1].docID)
      .get();
    snapshots = await songsCollection
      .orderBy('modifiedName')
      .startAfter(lastDoc)
      .limit(maxPerLoad.value)
      .get();
  } else {
    snapshots = await songsCollection
      .orderBy('modifiedName')
      .limit(maxPerLoad.value)
      .get();
  }

  snapshots.forEach((document) => {
    songs.value.push({
      docID: document.id,
      ...document.data(),
    });
  });

  pendingRequest.value = false;
};

const handleScroll = () => {
  const { scrollTop, offsetHeight } = document.documentElement;
  const { innerHeight } = window;
  const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

  if (bottomOfWindow) {
    getSongs();
  }
};

onMounted(() => {
  getSongs();

  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <main>
    <section class="mb-8 py-20 text-white text-center relative">
      <div
        class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"
      />
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">
            {{ t('home.listen') }}
          </h1>
          <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Phasellus et dolor mollis, congue augue non, venenatis elit.
            Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
            sapien. Duis sed magna pulvinar, fringilla lorem eget,
            ullamcorper urna.
          </p>
        </div>
      </div>

      <img
        class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png"
        alt=""
      >
    </section>

    <section class="relative container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div
          v-icon-secondary="{ icon: 'headphones-alt', right: true }"
          class="px-6 pt-6 pb-5 font-bold border-b border-gray-200"
        >
          <span class="card-title">Songs</span>
        </div>
        <ol id="playlist">
          <SongItem
            v-for="song in songs"
            :key="song.docID"
            :song="song"
          />
        </ol>
      </div>
    </section>
  </main>
</template>
