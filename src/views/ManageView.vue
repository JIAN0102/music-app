<script>
import { auth, songsCollection } from '@/includes/firebase';
import UploadSong from '@/components/UploadSong.vue';
import SongItem from '@/components/SongItem.vue';

export default ({
  name: 'ManageView',
  components: {
    UploadSong,
    SongItem,
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created() {
    const snapshot = await songsCollection
      .where('uid', '==', auth.currentUser.uid)
      .get();

    snapshot.forEach(this.addSong);
  },
  methods: {
    addSong(document) {
      const song = {
        ...document.data(),
        docID: document.id,
      };

      this.songs.push(song);
    },
    updateSong(index, { modifiedName, genre }) {
      this.songs[index].modifiedName = modifiedName;
      this.songs[index].genre = genre;
    },
    deleteSong(index) {
      this.songs.splice(index, 1);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
});
</script>

<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <UploadSong @add-song="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl" />
          </div>
          <div class="p-6">
            <SongItem
              v-for="(song, index) in songs"
              :key="song.docID"
              :song="song"
              :index="index"
              @update-song="updateSong"
              @delete-song="deleteSong"
              @update-unsaved-flag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
