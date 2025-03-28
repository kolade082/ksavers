import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  UploadStatement: undefined;
  Analysis: {
    fileUri: string;
  };
  SavingsSuggestions: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
}; 