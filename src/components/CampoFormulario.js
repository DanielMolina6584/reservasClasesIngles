import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors, radius, spacing} from '../theme';

// Campo de texto con etiqueta, mensaje de error y ayuda. Lo usan Registro e Iniciar sesión.
export default function CampoFormulario({ref, etiqueta, error, ayuda, estilo, ...props}) {
    return (
        <View style={[styles.campo, estilo]}>
            <Text style={styles.etiqueta}>{etiqueta}</Text>
            <TextInput
                ref={ref}
                style={[styles.input, error && styles.inputConError]}
                placeholderTextColor={colors.textoSuave}
                accessibilityLabel={etiqueta}
                accessibilityHint={error ?? ayuda}
                {...props}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {!error && ayuda ? <Text style={styles.ayuda}>{ayuda}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    campo: {marginBottom: spacing.lg},
    etiqueta: {color: colors.texto, fontSize: 14, fontWeight: '700', marginBottom: spacing.sm},
    input: {
        minHeight: 48,
        backgroundColor: colors.superficie,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.borde,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.texto,
        fontSize: 15,
    },
    inputConError: {borderColor: colors.peligro},
    error: {color: colors.peligro, fontSize: 12, marginTop: spacing.xs},
    ayuda: {color: colors.textoSuave, fontSize: 12, marginTop: spacing.xs},
});
