import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface ProfileScreenProps {
  navigation: NavigationProp;
}

// Mock data for stats (we'll implement real data later)
const mockStats = {
  totalAnalyses: 12,
  totalSavings: '£2,500',
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme, colors, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Extract user information
  const fullName = user?.displayName || 'User';
  const [firstName, lastName] = fullName.split(' ');
  const email = user?.email || '';
  
  // Format join date
  const joinDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      })
    : 'Recently';

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      // Navigation will be handled by AuthNavigator
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      title: 'Account Settings',
      icon: 'account-circle',
      onPress: () => {},
    },
    {
      title: 'Notification Preferences',
      icon: 'notifications',
      onPress: () => {},
      rightComponent: (
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={notificationsEnabled ? colors.success : colors.disabled}
        />
      ),
    },
    {
      title: 'Dark Mode',
      icon: 'dark-mode',
      onPress: () => {},
      rightComponent: (
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={theme === 'dark' ? colors.success : colors.disabled}
        />
      ),
    },
    {
      title: 'Privacy & Security',
      icon: 'security',
      onPress: () => {},
    },
    {
      title: 'Help & Support',
      icon: 'help',
      onPress: () => {},
    },
    {
      title: 'About KSavers',
      icon: 'info',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.background }]}>
            <MaterialIcons name="account-circle" size={80} color={colors.primary} />
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>{fullName}</Text>
          <Text style={[styles.userEmail, { color: colors.text }]}>{email}</Text>
          <Text style={[styles.joinDate, { color: colors.placeholder }]}>Member since {joinDate}</Text>
        </View>

        {/* Stats Cards */}
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="analytics" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{mockStats.totalAnalyses}</Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>Analyses</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <MaterialIcons name="savings" size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{mockStats.totalSavings}</Text>
            <Text style={[styles.statLabel, { color: colors.placeholder }]}>Total Savings</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons name={item.icon as any} size={24} color={colors.text} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              {item.rightComponent || (
                <MaterialIcons name="chevron-right" size={24} color={colors.text} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { backgroundColor: colors.card, borderColor: colors.error },
            loading && styles.buttonDisabled
          ]}
          onPress={handleLogout}
          disabled={loading}
        >
          <MaterialIcons name="logout" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 1,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen; 