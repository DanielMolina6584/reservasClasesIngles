import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

export default function EstadoVacio({ icono = 'calendar-outline', titulo, mensaje }) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.circulo}>
        <Ionicons name={icono} size={34} color={colors.primario} />
      </View>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.mensaje}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  circulo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  titulo: { fontSize: 17, fontWeight: '700', color: colors.texto, textAlign: 'center' },
  mensaje: {
    fontSize: 14,
    color: colors.textoSuave,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
});
