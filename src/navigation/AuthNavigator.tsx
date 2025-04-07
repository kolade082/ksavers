import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';

type AuthNavigatorProps = {
  children: React.ReactNode;
};

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ children }) => {
  const { user, loading, isEmailVerified } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check if email is verified
        if (isEmailVerified) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          // If not verified, go to email verification screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'EmailVerification' }],
          });
        }
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [user, loading, navigation, isEmailVerified]);

  return <>{children}</>;
};

export default AuthNavigator; 