import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import {
  LOGIN,
  LOGOUT,
  INIT_LOGIN,
  REGISTER,
  NEW_SONG,
  TOGGLE_SONG,
} from '@/store/actions.type';
import {
  TOGGLE_AUTH_MODAL,
  TOGGLE_AUTH,
} from '@/store/mutations.type';
import { Howl } from 'howler';

export default createStore({
  state: {
    authModalShow: false,
    isLoggedIn: false,
    currentSong: {},
    sound: {},
  },
  getters: {
    isSongPlaying: (state) => (state.sound.playing ? state.sound.playing() : false),
  },
  mutations: {
    [TOGGLE_AUTH_MODAL]: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    [TOGGLE_AUTH]: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
    [NEW_SONG]: (state, payload) => {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
  },
  actions: {
    [LOGIN]: async ({ commit }, { email, password }) => {
      await auth.signInWithEmailAndPassword(email, password);

      commit('TOGGLE_AUTH');
    },
    [LOGOUT]: async ({ commit }) => {
      await auth.signOut();

      commit('TOGGLE_AUTH');
    },
    [INIT_LOGIN]: ({ commit }) => {
      const user = auth.currentUser;

      if (user) {
        commit('TOGGLE_AUTH');
      }
    },
    [REGISTER]: async ({ commit }, {
      name, email, password, age, country,
    }) => {
      let userCredential = null;
      try {
        userCredential = await auth.createUserWithEmailAndPassword(
          email,
          password,
        );
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
    [NEW_SONG]: async ({ state, commit }, payload) => {
      commit('NEW_SONG', payload);

      state.sound.play();
    },
    [TOGGLE_SONG]: ({ state }) => {
      if (!state.sound.playing) {
        return;
      }

      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
  },
  modules: {
  },
});
