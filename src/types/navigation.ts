export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Home: undefined;
  Analysis: {
    fileUri: string;
  };
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: string;
}; 