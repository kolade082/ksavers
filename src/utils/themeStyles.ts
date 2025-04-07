import { StyleSheet } from 'react-native';
import { ThemeColors } from '../context/ThemeContext';

// Common themed styles that can be used across the app
export const createThemedStyles = (colors: ThemeColors) => StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: colors.placeholder,
    marginBottom: 4,
  },
  
  // Button styles
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Input styles
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 16,
  },
  
  // List styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
  
  // Icon styles
  icon: {
    color: colors.text,
  },
  iconPrimary: {
    color: colors.primary,
  },
  iconSecondary: {
    color: colors.secondary,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  
  // Status indicators
  successText: {
    color: colors.success,
  },
  errorText: {
    color: colors.error,
  },
  warningText: {
    color: colors.warning,
  },
  infoText: {
    color: colors.info,
  },
}); 