import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../context/ThemeContext';
import ThemedView from '../components/ThemedView';
import ThemedText from '../components/ThemedText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type UploadStatementProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UploadStatement'>;
};

const UploadStatement: React.FC<UploadStatementProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const handleFilePick = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result);
        // Simulate processing delay
        setTimeout(() => {
          navigation.navigate('Analysis', { fileUri: result.assets[0].uri });
        }, 1500);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ThemedView useCard style={styles.container}>
        <View style={styles.content}>
          <MaterialIcons 
            name="cloud-upload" 
            size={64} 
            color={colors.primary} 
            style={styles.icon}
          />
          
          <ThemedText variant="title" style={styles.title}>
            Upload Bank Statement
          </ThemedText>
          
          <ThemedText variant="body" style={styles.description}>
            Upload your bank statement in PDF format to analyze your spending patterns and get personalized savings suggestions.
          </ThemedText>

          {selectedFile && !selectedFile.canceled && selectedFile.assets && selectedFile.assets.length > 0 && (
            <ThemedView useCard style={styles.selectedFile}>
              <MaterialIcons name="description" size={24} color={colors.primary} />
              <View style={styles.fileInfo}>
                <ThemedText variant="body" numberOfLines={1}>
                  {selectedFile.assets[0].name}
                </ThemedText>
                <ThemedText variant="caption">
                  {selectedFile.assets[0].size ? `${(selectedFile.assets[0].size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}
                </ThemedText>
              </View>
            </ThemedView>
          )}

          <TouchableOpacity
            style={[styles.uploadButton, { backgroundColor: colors.primary }]}
            onPress={handleFilePick}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="upload-file" size={24} color="#fff" />
                <ThemedText style={styles.uploadButtonText}>
                  {selectedFile && !selectedFile.canceled && selectedFile.assets && selectedFile.assets.length > 0 
                    ? 'Choose Different File' 
                    : 'Select PDF File'}
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.instructions}>
            <ThemedText variant="caption" style={styles.instructionTitle}>
              Instructions:
            </ThemedText>
            <View style={styles.instructionItem}>
              <MaterialIcons name="check-circle" size={16} color={colors.success} />
              <ThemedText variant="caption" style={styles.instructionText}>
                Make sure your statement is in PDF format
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <MaterialIcons name="check-circle" size={16} color={colors.success} />
              <ThemedText variant="caption" style={styles.instructionText}>
                The file should be less than 10MB
              </ThemedText>
            </View>
            <View style={styles.instructionItem}>
              <MaterialIcons name="check-circle" size={16} color={colors.success} />
              <ThemedText variant="caption" style={styles.instructionText}>
                Ensure the statement is from the last 3 months
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    margin: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
  },
  selectedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  fileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 32,
  },
  uploadButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  instructions: {
    width: '100%',
  },
  instructionTitle: {
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    marginLeft: 8,
  },
});

export default UploadStatement; 