import React from 'react';
import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors, radius, spacing} from '../theme';

export const irAIniciarSesion = () =>
    Alert.alert('Próximamente', 'La opción "Iniciar sesión" estará disponible muy pronto.');

export const irARegistro = () =>
    Alert.alert('Próximamente', 'La opción "Registrarse" estará disponible muy pronto.');

export default function SesionRequerida({icono = 'lock-closed-outline', titulo, mensaje}) {
    return (
        <View style={styles.tarjeta}>
            <View style={styles.circulo}>
                <Ionicons name={icono} size={36} color={colors.primario}/>
            </View>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.mensaje}>{mensaje}</Text>
            <View style={styles.acciones}>
                <Pressable
                    style={({pressed}) => [styles.boton, pressed && styles.botonPresionado]}
                    onPress={irAIniciarSesion}
                    accessibilityRole="button"
                >
                    <Ionicons name="log-in-outline" size={18} color="#FFFFFF"/>
                    <Text style={styles.textoBoton}>Iniciar sesión</Text>
                </Pressable>
                <Pressable
                    style={({pressed}) => [styles.boton, styles.botonSecundario, pressed && styles.botonPresionado]}
                    onPress={irARegistro}
                    accessibilityRole="button"
                >
                    <Ionicons name="person-add-outline" size={18} color={colors.primario}/>
                    <Text style={[styles.textoBoton, styles.textoBotonSecundario]}>Registrarse</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    tarjeta: {
        alignItems: 'center',
        backgroundColor: colors.superficie,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.borde,
        padding: spacing.xl,
    },
    circulo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primarioSuave,
        borderWidth: 1,
        borderColor: colors.borde,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {
        color: colors.texto,
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: spacing.md,
    },
    mensaje: {
        color: colors.textoSuave,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    acciones: {alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.xl},
    boton: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primario,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.primario,
        paddingHorizontal: spacing.lg,
    },
    botonSecundario: {backgroundColor: colors.superficie},
    botonPresionado: {opacity: 0.8},
    textoBoton: {color: '#FFFFFF', fontWeight: '800'},
    textoBotonSecundario: {color: colors.primario},
});
