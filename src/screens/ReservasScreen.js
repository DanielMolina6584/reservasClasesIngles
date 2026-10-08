import React, {useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, View} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EstadoVacio from '../components/EstadoVacio';
import SesionRequerida from '../components/SesionRequerida';
import TarjetaReserva from '../components/TarjetaReserva';
import {obtenerDuracionReserva} from '../context/ReservasContext';
import useReserva from '../hooks/useReserva';
import useResponsive from '../hooks/useResponsive';
import useUsuario from '../hooks/useUsuario';
import {convertirHorarioAMinutos} from '../utils/horarios';
import {colors, spacing, typography} from '../theme';

// Los horarios que no se puedan leer van al final.
const posicionEnSemana = (reserva) => convertirHorarioAMinutos(reserva.horario) ?? Infinity;

export default function ReservasScreen() {
    const insets = useSafeAreaInsets();
    const {columnas, paddingHorizontal} = useResponsive();
    const {reservas, cargando, cancelarReserva} = useReserva();
    const {sesionIniciada, cargando: cargandoSesion} = useUsuario();
    const listaRef = useRef(null);
    useScrollToTop(listaRef);
    // Una sola cancelación a la vez: cancelarReserva parte del arreglo actual y dos seguidas
    // podrían volver a guardar la primera.
    const [cancelandoId, setCancelandoId] = useState(null);
    const cancelandoRef = useRef(false);

    // Orden de agenda: por día y hora de la semana.
    const reservasOrdenadas = useMemo(
        () => [...reservas].sort((a, b) => posicionEnSemana(a) - posicionEnSemana(b)),
        [reservas],
    );

    const cancelar = async (reserva) => {
        if (cancelandoRef.current) {
            return;
        }

        cancelandoRef.current = true;
        setCancelandoId(reserva.id);
        try {
            const cancelada = await cancelarReserva(reserva.id);
            if (cancelada) {
                Alert.alert('Reserva cancelada', `Se eliminó tu reserva de ${reserva.titulo} (${reserva.horario}).`);
            } else {
                Alert.alert('Reserva no encontrada', 'Esta reserva ya no existe.');
            }
        } catch (error) {
            Alert.alert('Error al cancelar', 'No se pudo cancelar la reserva. Inténtalo de nuevo.');
            console.error('Error cancelando la reserva:', error);
        } finally {
            cancelandoRef.current = false;
            setCancelandoId(null);
        }
    };

    const confirmarCancelacion = (reserva) => {
        Alert.alert(
            'Cancelar reserva',
            `¿Seguro que quieres cancelar tu reserva de ${reserva.titulo} (${reserva.horario})?`,
            [
                {text: 'No, mantener', style: 'cancel'},
                {text: 'Sí, cancelar', style: 'destructive', onPress: () => cancelar(reserva)},
            ],
        );
    };

    return (
        <View style={[styles.pantalla, {paddingTop: insets.top + spacing.md, paddingHorizontal}]}>
            <Text style={styles.titulo}>Mis reservas</Text>
            {cargando || cargandoSesion ? (
                <View style={styles.cargando}>
                    <ActivityIndicator size="large" color={colors.primario}/>
                </View>
            ) : !sesionIniciada ? (
                <View style={styles.sinSesion}>
                    <SesionRequerida
                        icono="calendar-outline"
                        titulo="Inicia sesión para ver tus reservas"
                        mensaje="Necesitas una cuenta para reservar clases y consultar tus reservas."
                    />
                </View>
            ) : (
                <FlatList
                    ref={listaRef}
                    data={reservasOrdenadas}
                    key={`reservas-${columnas}`}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <TarjetaReserva
                            reserva={item}
                            duracion={obtenerDuracionReserva(item)}
                            onCancelar={() => confirmarCancelacion(item)}
                            cancelando={cancelandoId === item.id}
                            deshabilitado={cancelandoId !== null}
                        />
                    )}
                    numColumns={columnas}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingBottom: spacing.xl, flexGrow: 1}}
                    columnWrapperStyle={columnas > 1 ? styles.fila : undefined}
                    ListEmptyComponent={
                        <EstadoVacio
                            icono="calendar-outline"
                            titulo="Aún no tienes reservas"
                            mensaje="Cuando reserves una clase aparecerá aquí."
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: {flex: 1, backgroundColor: colors.fondo},
    titulo: {...typography.titulo, marginBottom: spacing.lg},
    cargando: {flex: 1, alignItems: 'center', justifyContent: 'center'},
    sinSesion: {width: '100%', maxWidth: 520, alignSelf: 'center'},
    fila: {gap: spacing.md},
});
