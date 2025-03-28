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
  Profile: undefined;
  History: undefined;
  AnalysisDetail: {
    analysisId: string;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
}; 