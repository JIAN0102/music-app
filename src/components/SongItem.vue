<script setup>
defineProps({
  song: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <router-link
        class="font-bold block text-gray-600"
        :to="{ name: 'song', params: { id: song.docID } }"
      >
        {{ song.modifiedName }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ song.displayName }}</span>
    </div>
    <div class="text-gray-600 text-lg">
      <router-link
        v-slot="{ navigate }"
        custom
        :to="{
          name: 'song',
          params: { id: song.docID },
          hash: '#comments'
        }"
      >
        <span
          class="comments"
          @click="navigate"
          @keydown="navigate"
        >
          <i class="fa fa-comments text-gray-600" />
          {{ song.commentCount }}
        </span>
      </router-link>
    </div>
  </li>
</template>
