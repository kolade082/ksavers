import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Profile: undefined;
  Analysis: { fileUri: string };
  AnalysisDetails: { id: string };
  History: undefined;
  SavingsSuggestions: undefined;
  UploadStatement: undefined;
  EmailVerification: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
}; 