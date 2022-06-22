import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import {
  LOGIN,
  LOGOUT,
  INIT_LOGIN,
  REGISTER,
  SET_SONG,
  TOGGLE_SONG,
  UPDATE_PROGRESS,
  UPDATE_SEEK,
} from '@/store/actions.type';
import {
  TOGGLE_AUTH_MODAL,
  TOGGLE_AUTH,
  CREATE_SONG,
  UPDATE_POSITION,
} from '@/store/mutations.type';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    isLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  getters: {
    isSongPlaying: (state) => (state.sound.playing ? state.sound.playing() : false),
  },
  mutations: {
    [TOGGLE_AUTH_MODAL](state) {
      state.authModalShow = !state.authModalShow;
    },
    [TOGGLE_AUTH](state) {
      state.isLoggedIn = !state.isLoggedIn;
    },
    [CREATE_SONG](state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    [UPDATE_POSITION](state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  actions: {
    async [LOGIN]({ commit }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);

      commit('TOGGLE_AUTH');
    },
    async [LOGOUT]({ commit }) {
      await auth.signOut();

      commit('TOGGLE_AUTH');
    },
    [INIT_LOGIN]({ commit }) {
      const user = auth.currentUser;

      if (user) {
        commit('TOGGLE_AUTH');
      }
    },
    async [REGISTER]({ commit }, {
      name,
      email,
      password,
      age,
      country,
    }) {
      let userCredential = null;
      try {
        userCredential = await auth.createUserWithEmailAndPassword(email, password);
      } catch (error) {
        console.log(error);
      }

      await usersCollection.doc(userCredential.user.uid).set({
        name,
        email,
        age,
        country,
      });

      await userCredential.user.updateProfile({
        displayName: name,
      });

      commit('TOGGLE_AUTH');
    },
    async [SET_SONG]({ state, dispatch, commit }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload();
      }

      commit('CREATE_SONG', payload);

      state.sound.play();

      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('UPDATE_PROGRESS');
        });
      });
    },
    [TOGGLE_SONG]({ state }) {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    [UPDATE_PROGRESS]({ state, dispatch, commit }) {
      commit('UPDATE_POSITION');

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('UPDATE_PROGRESS');
        });
      }
    },
    [UPDATE_SEEK]({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }

      const { x, width } = payload.currentTarget.getBoundingClientRect();

      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('UPDATE_PROGRESS');
      });
    },
  },
  modules: {},
});
