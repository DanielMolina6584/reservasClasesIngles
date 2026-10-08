import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import EtiquetaNivel from './EtiquetaNivel';
import {colors, radius, spacing, typography} from '../theme';
import {formatearPrecio} from '../data/clases';

// La tarjeta no abre el detalle; su única acción es cancelar la reserva.
export default function TarjetaReserva({reserva, duracion, onCancelar, cancelando, deshabilitado}) {
    return (
        <View style={styles.tarjeta}>
            <EtiquetaNivel nivel={reserva.nivel}/>
            <Text style={styles.titulo}>{reserva.titulo}</Text>
            <Text style={styles.profesor}>{reserva.profesor}</Text>

            <View style={styles.fila}>
                <Ionicons name="calendar-outline" size={16} color={colors.primario}/>
                <Text style={styles.dato}>{reserva.horario}</Text>
            </View>
            {duracion != null && (
                <View style={styles.fila}>
                    <Ionicons name="time-outline" size={16} color={colors.primario}/>
                    <Text style={styles.dato}>{`${duracion} min`}</Text>
                </View>
            )}

            <Text style={styles.precio}>{formatearPrecio(reserva.precio)}</Text>

            <Pressable
                style={[styles.botonCancelar, deshabilitado && styles.botonDeshabilitado]}
                onPress={onCancelar}
                disabled={deshabilitado}
                accessibilityRole="button"
                accessibilityLabel={`Cancelar reserva de ${reserva.titulo}, ${reserva.horario}`}
                accessibilityState={{disabled: deshabilitado, busy: cancelando}}
            >
                <Ionicons name="close-circle-outline" size={18} color={colors.peligro}/>
                <Text style={styles.textoCancelar}>{cancelando ? 'Cancelando...' : 'Cancelar reserva'}</Text>
            </Pressable>
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
    titulo: {...typography.titulo, fontSize: 16, marginTop: spacing.sm},
    profesor: {color: colors.textoSuave, marginTop: spacing.xs},
    fila: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm},
    dato: {color: colors.texto, fontSize: 14},
    precio: {color: colors.primario, fontWeight: '800', marginTop: spacing.md},
    botonCancelar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        minHeight: 44,
        marginTop: spacing.md,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.peligro,
    },
    botonDeshabilitado: {opacity: 0.5},
    textoCancelar: {color: colors.peligro, fontWeight: '700'},
});
