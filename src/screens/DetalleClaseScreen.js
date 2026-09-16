import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EtiquetaNivel from '../componets/EtiquetaNivel';
import { formatearPrecio } from '../data/clases';
import { colors, radius, spacing, typhography } from '../theme';

export default function DetalleClaseScreen({ route }) {
  const insets = useSafeAreaInsets();
  const { clase } = route.params;

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

          <View style={styles.datos}>
            <Dato icono="cash-outline" etiqueta="Precio" valor={formatearPrecio(clase.precio)} />
            <Dato icono="time-outline" etiqueta="Duración" valor={`${clase.duracion} min`} />
            <Dato icono="people-outline" etiqueta="Cupos" valor={`${clase.cupos}`} />
          </View>

          <Text style={styles.subtitulo}>Horarios disponibles</Text>
          <View style={styles.horarios}>
            {clase.horarios.map((horario) => (
              <View key={horario} style={styles.horario}>
                <Ionicons name="calendar-outline" size={16} color={colors.primario} />
                <Text style={styles.textoHorario}>{horario}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.barra, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.etiqueta}>Precio por clase</Text>
          <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
        </View>
        <Pressable style={styles.boton}>
          <Text style={styles.textoBoton}>Reservar clase</Text>
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
  titulo: { ...typhography.titulo, fontSize: 24, marginTop: spacing.md },
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
  textoBoton: { color: '#FFFFFF', fontWeight: '800' },
});
