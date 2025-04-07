import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemedTextProps extends TextProps {
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'success' | 'error' | 'warning' | 'info';
}

const ThemedText: React.FC<ThemedTextProps> = ({ style, variant = 'body', ...props }) => {
  const { colors } = useTheme();
  
  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return colors.success;
      case 'error':
        return colors.error;
      case 'warning':
        return colors.warning;
      case 'info':
        return colors.info;
      default:
        return colors.text;
    }
  };
  
  const getFontSize = () => {
    switch (variant) {
      case 'title':
        return 24;
      case 'subtitle':
        return 18;
      case 'body':
        return 16;
      case 'caption':
        return 14;
      default:
        return 16;
    }
  };
  
  const getFontWeight = () => {
    switch (variant) {
      case 'title':
      case 'subtitle':
        return 'bold';
      case 'body':
      case 'caption':
        return 'normal';
      default:
        return 'normal';
    }
  };
  
  return (
    <Text
      style={[
        styles.text,
        {
          color: getTextColor(),
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
        },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    marginBottom: 4,
  },
});

export default ThemedText; 