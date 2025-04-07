import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface ThemedViewProps extends ViewProps {
  useCard?: boolean;
}

const ThemedView: React.FC<ThemedViewProps> = ({ style, useCard = false, ...props }) => {
  const { colors } = useTheme();
  
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: useCard ? colors.card : colors.background },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ThemedView; 