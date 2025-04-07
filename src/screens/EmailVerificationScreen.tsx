import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

type EmailVerificationScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;
};

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ navigation }) => {
  const { user, isEmailVerified, sendVerificationEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Check if email is already verified
    if (isEmailVerified) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }

    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEmailVerified, navigation]);

  const handleResendEmail = async () => {
    if (!canResend) return;

    try {
      setLoading(true);
      await sendVerificationEmail();
      Alert.alert('Success', 'Verification email has been resent');
      setCanResend(false);
      setCountdown(60);
    } catch (error: any) {
      console.error('Error resending verification email:', error);
      Alert.alert('Error', 'Failed to resend verification email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setLoading(true);
      // Reload the user to check if email is verified
      await user?.reload();
      
      // Check if email is verified after reload
      if (user?.emailVerified) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert('Not Verified', 'Your email is not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      Alert.alert('Error', 'Failed to check verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>KS</Text>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>We've sent a verification link to your email</Text>
      </View>

      <View style={styles.content}>
        <MaterialIcons name="mail" size={80} color="#007AFF" style={styles.icon} />
        
        <Text style={styles.instructionText}>
          Please check your email ({user?.email}) and click on the verification link to activate your account.
        </Text>
        
        <Text style={styles.noteText}>
          If you don't see the email, check your spam folder.
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheckVerification}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>I've Verified My Email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the email?</Text>
          <TouchableOpacity
            onPress={handleResendEmail}
            disabled={!canResend || loading}
          >
            <Text style={[styles.resendLink, !canResend && styles.resendLinkDisabled]}>
              {canResend ? 'Resend Email' : `Resend in ${countdown}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  noteText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendLink: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  resendLinkDisabled: {
    color: '#999',
  },
});

export default EmailVerificationScreen; 