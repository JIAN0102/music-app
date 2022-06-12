import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import {
  LOGIN,
  LOGOUT,
  INIT_LOGIN,
  REGISTER,
} from '@/store/actions.type';
import {
  TOGGLE_AUTH_MODAL,
  TOGGLE_AUTH,
} from '@/store/mutations.type';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    [TOGGLE_AUTH_MODAL]: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    [TOGGLE_AUTH]: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
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
        console.log('錯誤訊息', error);
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
  },
  modules: {
  },
});
