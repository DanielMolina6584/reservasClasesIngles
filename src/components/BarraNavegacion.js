import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';

const ALTURA_BARRA = 56;

export default function BarraNavegacion({ state, navigation, descriptors }) {
  const insets = useSafeAreaInsets();
  const tecladoVisible = useTecladoVisible();

  if (tecladoVisible) {
    return null;
  }

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.barra, { height: ALTURA_BARRA + insets.bottom, paddingBottom: insets.bottom }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const enfocada = state.index === index;

        const alPresionar = () => {
          const evento = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!enfocada && !evento.defaultPrevented) {
            navigation.dispatch({ ...TabActions.jumpTo(route.name, route.params), target: state.key });
          }
        };

        return (
          <Pressable
            key={route.key}
            style={styles.opcion}
            onPress={alPresionar}
            accessibilityRole="tab"
            accessibilityLabel={options.etiqueta ?? route.name}
            accessibilityState={{ selected: enfocada }}
          >
            <View style={[styles.indicador, enfocada && styles.indicadorActivo]}>
              <Ionicons
                name={enfocada ? options.icono : `${options.icono}-outline`}
                size={24}
                color={enfocada ? colors.primario : colors.textoSuave}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function useTecladoVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const mostrar = Keyboard.addListener('keyboardDidShow', () => setVisible(true));
    const ocultar = Keyboard.addListener('keyboardDidHide', () => setVisible(false));

    return () => {
      mostrar.remove();
      ocultar.remove();
    };
  }, []);

  return visible;
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
  },
  opcion: {
    flex: 1,
    height: ALTURA_BARRA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicador: {
    width: 64,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicadorActivo: { backgroundColor: colors.primarioSuave },
});
