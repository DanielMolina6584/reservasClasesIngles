import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import EtiquetaNivel from './EtiquetaNivel';
import { colors, radius, spacing, typhography } from '../theme';
import { formatearPrecio } from '../data/clases';

export default function Card({ clase, onPress }) {
  return (
    <Pressable style={styles.tarjeta} onPress={onPress}>
      <Image source={{ uri: clase.imagen }} style={styles.imagen} />
      <View style={styles.contenido}>
        <EtiquetaNivel nivel={clase.nivel} />
        <Text style={styles.titulo}>{clase.titulo}</Text>
        <Text style={styles.profesor}>{clase.profesor.nombre}</Text>
        <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  imagen: { width: '100%', height: 150, backgroundColor: colors.primarioSuave },
  contenido: { padding: spacing.md },
  titulo: { ...typhography.titulo, fontSize: 16, marginTop: spacing.sm },
  profesor: { color: colors.textoSuave, marginTop: spacing.sm },
  precio: { color: colors.primario, fontWeight: '800', marginTop: spacing.md },
});