import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator();

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const pickDocument = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        setSelectedFile(result);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (fileUri: string) => {
    try {
      setIsLoading(true);
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to Analysis screen with the file URI
      navigation.navigate('Analysis', { fileUri });
      
      Alert.alert('Success', 'Your bank statement has been uploaded and analyzed.');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload your bank statement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>KSavers</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to KSavers!</Text>
        <Text style={styles.subText}>Upload your bank statement to analyze your spending patterns</Text>
        
        <View style={styles.uploadContainer}>
          {selectedFile ? (
            <View style={styles.filePreview}>
              <MaterialIcons name="description" size={48} color="#2196F3" />
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile?.assets?.[0]?.name || 'Unknown file'}
              </Text>
              <Text style={styles.fileSize}>
                {selectedFile?.assets?.[0]?.size 
                  ? `${(selectedFile.assets[0].size / 1024 / 1024).toFixed(2)} MB`
                  : 'Unknown size'}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickDocument}
              disabled={isLoading}
            >
              <MaterialIcons name="cloud-upload" size={48} color="#2196F3" />
              <Text style={styles.uploadText}>Select Statement</Text>
              <Text style={styles.uploadSubtext}>
                PDF or Image files (max 10MB)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialIcons name="security" size={24} color="#2196F3" />
            <Text style={styles.infoText}>
              Your data is encrypted and secure
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialIcons name="schedule" size={24} color="#2196F3" />
            <Text style={styles.infoText}>
              Analysis takes about 2-3 minutes
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !selectedFile && styles.submitButtonDisabled]}
          onPress={() => {
            if (selectedFile?.assets?.[0]?.uri) {
              handleUpload(selectedFile.assets[0].uri);
            }
          }}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Upload & Analyze</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Analysis" component={AnalysisScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  uploadContainer: {
    marginBottom: 30,
  },
  uploadButton: {
    width: '100%',
    height: 200,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
