<script setup>
import { ref, onBeforeMount } from 'vue';
import { auth, songsCollection, storage } from '@/includes/firebase';

const emit = defineEmits(['upload-song']);

const isDragOver = ref(false);
const uploads = ref([]);

onBeforeMount(() => {
  uploads.value.forEach((upload) => {
    upload.task.cancel();
  });
});

const uploadFile = (event) => {
  isDragOver.value = false;

  const files = event.dataTransfer
    ? [...event.dataTransfer.files]
    : [...event.target.files];

  files.forEach((file) => {
    if (file.type !== 'audio/mpeg') {
      return;
    }

    if (!navigator.onLine) {
      uploads.value.push({
        task: {},
        currentProgress: 100,
        name: file.name,
        variant: 'bg-red-400',
        icon: 'fas fa-times',
        textClass: 'text-red-400',
      });
      return;
    }

    const storageRef = storage.ref();
    const songsRef = storageRef.child(`songs/${file.name}`);
    const task = songsRef.put(file);

    const uploadIndex = uploads.value.push({
      task,
      currentProgress: 0,
      name: file.name,
      variant: 'bg-blue-400',
      icon: 'fas fa-spinner fa-spin',
      textClass: '',
    }) - 1;

    task.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      uploads.value[uploadIndex].currentProgress = progress;
    }, (error) => {
      uploads.value[uploadIndex].variant = 'bg-red-400';
      uploads.value[uploadIndex].icon = 'fas fa-times';
      uploads.value[uploadIndex].textClass = 'text-red-400';
      console.log(error);
    }, async () => {
      const song = {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        originalName: task.snapshot.ref.name,
        modifiedName: task.snapshot.ref.name,
        genre: '',
        commentCount: 0,
      };

      song.url = await task.snapshot.ref.getDownloadURL();
      const songRef = await songsCollection.add(song);
      const songSnapShot = await songRef.get();

      emit('upload-song', songSnapShot);

      uploads.value[uploadIndex].variant = 'bg-green-400';
      uploads.value[uploadIndex].icon = 'fas fa-check';
      uploads.value[uploadIndex].textClass = 'text-green-400';
    });
  });
};
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl" />
    </div>
    <div class="p-6">
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'text-white bg-green-400 border-green-400 border-solid': isDragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="uploadFile($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input
        type="file"
        multiple
        @change="uploadFile"
      >
      <hr class="my-6">
      <div
        v-for="upload in uploads"
        :key="upload.name"
        class="mb-4"
      >
        <div
          class="font-bold text-sm"
          :class="upload.textClass"
        >
          <i :class="upload.icon" /> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: `${upload.currentProgress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
