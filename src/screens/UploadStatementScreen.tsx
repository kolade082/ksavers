import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';

export default function UploadStatementScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentResult | null>(null);

  const pickDocument = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setSelectedFile(result);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement actual file upload logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated upload
      Alert.alert('Success', 'Statement uploaded successfully!');
      setSelectedFile(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload statement');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Bank Statement</Text>
        <Text style={styles.subtitle}>
          Upload your bank statement to analyze your spending patterns
        </Text>
      </View>

      <View style={styles.uploadContainer}>
        {selectedFile ? (
          <View style={styles.filePreview}>
            <MaterialIcons name="description" size={48} color="#2196F3" />
            <Text style={styles.fileName} numberOfLines={1}>
              {selectedFile.name}
            </Text>
            <Text style={styles.fileSize}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
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
        onPress={handleUpload}
        disabled={!selectedFile || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Upload & Analyze</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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