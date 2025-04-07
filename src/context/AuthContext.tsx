import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { useAuthPersistence } from '../hooks/useAuthPersistence';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use our custom persistence hook
  useAuthPersistence();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If user exists, reload to get the latest email verification status
      if (user) {
        try {
          await user.reload();
          console.log('User reloaded, email verified:', user.emailVerified);
        } catch (error) {
          console.error('Error reloading user:', error);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      console.log('AuthContext: Attempting to create user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: User created successfully:', userCredential.user.uid);
      
      // Update the user's profile with first and last name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      console.log('AuthContext: Updated user profile with name:', `${firstName} ${lastName}`);
      
      // Send verification email
      await sendEmailVerification(userCredential.user);
      console.log('AuthContext: Verification email sent');
      
      return userCredential;
    } catch (error) {
      console.error('AuthContext: Error creating user:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Attempting to sign in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Sign in successful, user ID:', userCredential.user.uid);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        console.log('AuthContext: User email not verified');
        // We'll let the AuthNavigator handle navigation based on email verification status
      } else {
        console.log('AuthContext: User email verified');
      }
    } catch (error: any) {
      console.error('AuthContext: Sign in error:', error);
      console.error('AuthContext: Error code:', error.code);
      console.error('AuthContext: Error message:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    try {
      await sendEmailVerification(user);
      console.log('Verification email sent successfully');
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    sendVerificationEmail,
    isEmailVerified: user?.emailVerified || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 