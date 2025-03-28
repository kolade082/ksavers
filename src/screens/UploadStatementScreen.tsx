import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { NavigationProp } from '../types/navigation';

interface UploadStatementScreenProps {
  navigation: NavigationProp;
}

const UploadStatementScreen: React.FC<UploadStatementScreenProps> = ({ navigation }) => {
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Upload Statement</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Upload Your Bank Statement</Text>
        <Text style={styles.subtitle}>
          Upload your bank statement in PDF or image format to analyze your spending patterns
        </Text>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
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

export default UploadStatementScreen; 