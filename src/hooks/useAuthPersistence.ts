import { useEffect } from 'react';
import { User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AUTH_USER_KEY = '@auth_user';

export const useAuthPersistence = () => {
  useEffect(() => {
    // Load persisted user on app start
    const loadPersistedUser = async () => {
      try {
        const persistedUserJson = await AsyncStorage.getItem(AUTH_USER_KEY);
        if (persistedUserJson) {
          const persistedUser = JSON.parse(persistedUserJson);
          console.log('Loaded persisted user from AsyncStorage:', persistedUser.email);
        }
      } catch (error) {
        console.error('Error loading persisted user:', error);
      }
    };

    loadPersistedUser();

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        // User is signed in, persist the user data
        try {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
          };
          await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
          console.log('Persisted user to AsyncStorage:', user.email);
        } catch (error) {
          console.error('Error persisting user:', error);
        }
      } else {
        // User is signed out, remove persisted data
        try {
          await AsyncStorage.removeItem(AUTH_USER_KEY);
          console.log('Removed persisted user from AsyncStorage');
        } catch (error) {
          console.error('Error removing persisted user:', error);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
}; 