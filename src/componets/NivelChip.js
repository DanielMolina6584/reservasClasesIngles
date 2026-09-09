import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';


export default function NivelChip ({etiqueta, activo, onPress}) {
    return (
        <Pressable
            style={[styles.chip, activo && styles.chipActivo]}
            onPress={onPress}
        >
            <Text style={[styles.texto, activo && styles.textoActivo]}>{etiqueta}</Text>
        </Pressable>
    );

}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActivo: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  texto: { fontSize: 13, fontWeight: '600', color: colors.texto },
  textoActivo: { color: '#FFFFFF' },
});