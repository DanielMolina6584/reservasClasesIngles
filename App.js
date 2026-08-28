import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {navigatecontainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ClassesStack from './src/navigation/ClasesStack';

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={temaNavegacion}>
        <StatusBar style='dark' />
        <ClassesStack/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


