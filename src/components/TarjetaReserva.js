import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EtiquetaNivel from './EtiquetaNivel';
import { colors, radius, spacing, typography } from '../theme';
import { formatearPrecio } from '../data/clases';

// Tarjeta de solo lectura: no abre el detalle de la reserva.
export default function TarjetaReserva({ reserva, duracion }) {
  return (
    <View style={styles.tarjeta}>
      <EtiquetaNivel nivel={reserva.nivel} />
      <Text style={styles.titulo}>{reserva.titulo}</Text>
      <Text style={styles.profesor}>{reserva.profesor}</Text>

      <View style={styles.fila}>
        <Ionicons name="calendar-outline" size={16} color={colors.primario} />
        <Text style={styles.dato}>{reserva.horario}</Text>
      </View>
      {duracion != null && (
        <View style={styles.fila}>
          <Ionicons name="time-outline" size={16} color={colors.primario} />
          <Text style={styles.dato}>{`${duracion} min`}</Text>
        </View>
      )}

      <Text style={styles.precio}>{formatearPrecio(reserva.precio)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  titulo: { ...typography.titulo, fontSize: 16, marginTop: spacing.sm },
  profesor: { color: colors.textoSuave, marginTop: spacing.xs },
  fila: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  dato: { color: colors.texto, fontSize: 14 },
  precio: { color: colors.primario, fontWeight: '800', marginTop: spacing.md },
});
