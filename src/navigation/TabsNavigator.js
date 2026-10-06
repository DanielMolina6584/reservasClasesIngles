import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { createNavigatorFactory, TabRouter, useNavigationBuilder } from '@react-navigation/native';
import BarraNavegacion from '../components/BarraNavegacion';

function TabsNavigator({
  id,
  initialRouteName,
  backBehavior,
  children,
  screenListeners,
  screenOptions,
}) {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
    id,
    initialRouteName,
    backBehavior,
    children,
    screenListeners,
    screenOptions,
  });
  const rutaActiva = state.routes[state.index];

  const [visitadas, setVisitadas] = useState([rutaActiva.key]);
  if (!visitadas.includes(rutaActiva.key)) {
    setVisitadas([...visitadas, rutaActiva.key]);
  }

  return (
    <NavigationContent>
      <View style={styles.contenedor}>
        {state.routes.map((route) => {
          const enfocada = route.key === rutaActiva.key;
          if (!enfocada && !visitadas.includes(route.key)) {
            return null;
          }

          return (
            <View
              key={route.key}
              style={[styles.pantalla, !enfocada && styles.oculta]}
              accessibilityElementsHidden={!enfocada}
              importantForAccessibility={enfocada ? 'auto' : 'no-hide-descendants'}
            >
              {descriptors[route.key].render()}
            </View>
          );
        })}
      </View>
      <BarraNavegacion state={state} navigation={navigation} descriptors={descriptors} />
    </NavigationContent>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1 },
  pantalla: { flex: 1 },
  oculta: { display: 'none' },
});

export default createNavigatorFactory(TabsNavigator);
