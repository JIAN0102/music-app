import { defineStore } from 'pinia';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export const useSongStore = defineStore('song', {
  state: () => ({
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
    volume: '100%',
  }),
  getters: {
    isSongPlaying: (state) => (state.sound.playing ? state.sound.playing() : false),
  },
  actions: {
    createSong(payload) {
      this.currentSong = payload;
      this.sound = new Howl({
        src: [payload.url],
        html5: true,
        volume: 1,
      });
    },
    updatePosition() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());
      this.playerProgress = `${(this.sound.seek() / this.sound.duration()) * 100}%`;
    },
    updateProgress() {
      this.updatePosition();

      if (this.sound.playing()) {
        requestAnimationFrame(() => {
          this.updateProgress();
        });
      }
    },
    updateSeek(payload) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();

      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);

      this.sound.once('seek', () => {
        this.updateProgress();
      });
    },
    updateVolume(payload) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();

      const clickX = payload.clientX - x;
      const percentage = clickX / width;

      this.sound.volume(percentage);
      this.volume = `${percentage * 100}%`;
    },
    async setSong(payload) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.createSong(payload);

      this.sound.play();

      this.sound.on('play', () => {
        requestAnimationFrame(() => {
          this.updateProgress();
        });
      });
    },
  },
});
