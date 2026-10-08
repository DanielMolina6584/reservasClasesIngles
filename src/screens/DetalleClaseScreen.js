import React, { useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EtiquetaNivel from '../components/EtiquetaNivel';
import { irAIniciarSesion, irARegistro } from '../components/SesionRequerida';
import { formatearPrecio } from '../data/clases';
import useReserva from '../hooks/useReserva';
import useUsuario from '../hooks/useUsuario';
import { colors, radius, spacing, typography } from '../theme';

export default function DetalleClaseScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { clase } = route.params;
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(clase.horarios[0] ?? null);
  const [reservando, setReservando] = useState(false);
  const reservandoRef = useRef(false);
  const { agregarReserva, cargando, obtenerCuposDisponibles } = useReserva();
  const { sesionIniciada, cargando: cargandoSesion } = useUsuario();
  const cuposDisponibles = obtenerCuposDisponibles(clase);

  const pedirSesion = () => {
    Alert.alert('Inicia sesión para reservar', 'Necesitas una cuenta para reservar clases.', [
      { text: 'Ahora no', style: 'cancel' },
      { text: 'Registrarse', onPress: () => irARegistro(navigation) },
      { text: 'Iniciar sesión', onPress: irAIniciarSesion },
    ]);
  };

  const reservarClase = async () => {
    if (!sesionIniciada) {
      pedirSesion();
      return;
    }
    if (!horarioSeleccionado || cuposDisponibles <= 0 || reservandoRef.current) {
      return;
    }

    reservandoRef.current = true;
    setReservando(true);
    try {
      const { motivo, conflicto } = await agregarReserva(clase, horarioSeleccionado);
      if (motivo === 'sinSesion') {
        pedirSesion();
        return;
      }
      if (motivo === 'duplicada') {
        Alert.alert('Horario ya reservado', 'Ya tienes una reserva para este horario.');
        return;
      }
      if (motivo === 'ocupado') {
        Alert.alert(
          'Horario ocupado',
          `Ese horario ya está ocupado: se cruza con tu reserva de ${conflicto.titulo} (${conflicto.horario}).`,
        );
        return;
      }
      Alert.alert('Reserva solicitada', `Reserva confirmada: ${clase.titulo}`);
    } catch (error) {
      Alert.alert('Error al reservar', 'No se pudo guardar la reserva. Inténtalo de nuevo.');
      console.error('Error guardando la reserva:', error);
    } finally {
      reservandoRef.current = false;
      setReservando(false);
    }
  };

  return (
    <View style={styles.pantalla}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Image
          source={{ uri: clase.imagen }}
          resizeMode="cover"
          style={styles.portada}
        />
        <View style={styles.contenido}>
          <View style={styles.encabezado}>
            <EtiquetaNivel nivel={clase.nivel} />
            <Text style={styles.modalidad}>{clase.modalidad}</Text>
          </View>
          <Text style={styles.titulo}>{clase.titulo}</Text>

          <View style={styles.profesor}>
            <Image source={{ uri: clase.profesor.foto }} style={styles.avatar} />
            <View>
              <Text style={styles.etiqueta}>Profesor</Text>
              <Text style={styles.nombreProfesor}>{clase.profesor.nombre}</Text>
              <Text style={styles.pais}>{clase.profesor.pais}</Text>
            </View>
          </View>

          <Text style={styles.descripcion}>{clase.descripcion}</Text>

          <View style={styles.datos}>
            <Dato icono="cash-outline" etiqueta="Precio" valor={formatearPrecio(clase.precio)} />
            <Dato icono="time-outline" etiqueta="Duración" valor={`${clase.duracion} min`} />
            <Dato icono="people-outline" etiqueta="Cupos" valor={`${cuposDisponibles}`} />
            <Dato icono="star-outline" etiqueta="Calificación" valor={`${clase.rating}`} />
          </View>

          <Text style={styles.subtitulo}>Horarios disponibles</Text>
          <View style={styles.horarios}>
            {clase.horarios.map((horario) => (
              <Pressable
                key={horario}
                style={[
                  styles.horario,
                  horario === horarioSeleccionado && styles.horarioSeleccionado,
                ]}
                onPress={() => setHorarioSeleccionado(horario)}
                accessibilityRole="button"
                accessibilityState={{ selected: horario === horarioSeleccionado }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={horario === horarioSeleccionado ? colors.primario : colors.textoSuave}
                />
                <Text style={styles.textoHorario}>{horario}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.barra, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.etiqueta}>Precio por clase</Text>
          <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
        </View>
        <Pressable
          style={[styles.boton, cuposDisponibles === 0 && styles.botonDeshabilitado]}
          onPress={reservarClase}
          disabled={cargando || cargandoSesion || reservando || cuposDisponibles === 0 || !horarioSeleccionado}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>
            {cuposDisponibles === 0
              ? 'Agotado'
              : reservando || cargando || cargandoSesion
                ? 'Cargando...'
                : sesionIniciada
                  ? 'Reservar clase'
                  : 'Inicia sesión para reservar'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Dato({ icono, etiqueta, valor }) {
  return (
    <View style={styles.dato}>
      <Ionicons name={icono} size={20} color={colors.primario} />
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <Text style={styles.datoValor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  portada: {
    width: "100%",
    height: 220,
    backgroundColor: colors.primarioSuave,
  },
  contenido: { padding: spacing.lg },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalidad: { color: colors.textoSuave, fontSize: 12 },
  titulo: { ...typography.titulo, fontSize: 24, marginTop: spacing.md },
  profesor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
    backgroundColor: colors.borde,
  },
  etiqueta: { color: colors.textoSuave, fontSize: 12 },
  nombreProfesor: {
    color: colors.texto,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  pais: { color: colors.textoSuave, fontSize: 12, marginTop: 2 },
  descripcion: { color: colors.textoSuave, lineHeight: 22, marginTop: spacing.lg },
  datos: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  dato: { alignItems: 'center', gap: 3, maxWidth: 110 },
  datoValor: {
    color: colors.texto,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitulo: {
    color: colors.texto,
    fontSize: 17,
    fontWeight: '800',
    marginTop: spacing.xl,
  },
  horarios: { gap: spacing.sm, marginTop: spacing.md },
  horario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
  },
  horarioSeleccionado: {
    borderWidth: 1,
    borderColor: colors.primario,
    backgroundColor: colors.primarioSuave,
  },
  textoHorario: { color: colors.texto, fontSize: 14 },
  barra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    padding: spacing.lg,
  },
  precio: { color: colors.primario, fontSize: 17, fontWeight: '800', marginTop: 2 },
  boton: {
    backgroundColor: colors.primario,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  botonDeshabilitado: { backgroundColor: colors.textoSuave },
  textoBoton: { color: '#FFFFFF', fontWeight: '800' },
});
