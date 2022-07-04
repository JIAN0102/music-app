import { defineStore } from 'pinia';
import { auth, usersCollection } from '@/includes/firebase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authModalShow: false,
    isLoggedIn: false,
  }),
  actions: {
    toggleAuthModal() {
      this.authModalShow = !this.authModalShow;
    },
    toggleAuth() {
      this.isLoggedIn = !this.isLoggedIn;
    },
    async login({ email, password }) {
      await auth.signInWithEmailAndPassword(email, password);

      this.toggleAuth();
    },
    async logout() {
      await auth.signOut();

      this.toggleAuth();
    },
    initLogin() {
      const user = auth.currentUser;

      if (user) {
        this.toggleAuth();
      }
    },
    async register({
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

      this.toggleAuth();
    },
  },
});
