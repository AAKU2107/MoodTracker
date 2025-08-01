// In app/_layout.js
import { Stack } from 'expo-router';
import React from 'react';

const RootLayout = () => {
  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: '#007AFF', // Vibrant blue header
      },
      headerTintColor: '#FFFFFF', // White header text
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="log-mood"
        options={{
          title: "Log Today's Mood",
          presentation: 'modal',
        }}
      />
    </Stack>
  );
};

export default RootLayout;