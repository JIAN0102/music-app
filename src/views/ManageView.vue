<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { auth, songsCollection } from '@/includes/firebase';
import UploadSong from '@/components/UploadSong.vue';
import SongModify from '@/components/SongModify.vue';

const songs = ref([]);
const unsavedFlag = ref(false);
const maxPerLoad = ref(10);
const pendingRequest = ref(false);

onBeforeRouteLeave((to, from, next) => {
  if (!unsavedFlag.value) {
    next();
  } else {
    const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
    next(leave);
  }
});

const uploadSong = (document) => {
  const song = {
    docID: document.id,
    ...document.data(),
  };

  songs.value.push(song);
};

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
      .where('uid', '==', auth.currentUser.uid)
      .startAfter(lastDoc)
      .limit(maxPerLoad.value)
      .get();
  } else {
    snapshots = await songsCollection
      .where('uid', '==', auth.currentUser.uid)
      .limit(maxPerLoad.value)
      .get();
  }

  snapshots.forEach(uploadSong);

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

const editSong = (index, { modifiedName, genre }) => {
  songs.value[index].modifiedName = modifiedName;
  songs.value[index].genre = genre;
};

const deleteSong = (index) => {
  songs.value.splice(index, 1);
};

const updateUnsavedFlag = (value) => {
  unsavedFlag.value = value;
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
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <UploadSong @upload-song="uploadSong" />
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">My Songs</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl" />
            </div>
            <div class="p-6">
              <SongModify
                v-for="(song, index) in songs"
                :key="song.docID"
                :song="song"
                :index="index"
                @edit-song="editSong"
                @delete-song="deleteSong"
                @update-unsaved-flag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
