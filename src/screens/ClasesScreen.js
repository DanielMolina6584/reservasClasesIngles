import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Card from '../components/Card';
import EstadoVacio from '../components/EstadoVacio';
import NivelChip from '../components/NivelChip';
import useResponsive from '../hooks/useResponsive';
import { CLASES, NIVELES } from '../data/clases';
import { colors, radius, spacing, typography } from '../theme';

// Quita tildes para que "ingles" encuentre "Inglés".
const normalizar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function ClasesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { columnas, paddingHorizontal } = useResponsive();
  const [nivel, setNivel] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const resultados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return CLASES.filter((clase) => {
      const coincideNivel = nivel === 'Todos' || clase.nivel === nivel;
      const coincideTexto = !texto
        || normalizar(clase.profesor.nombre).includes(texto)
        || normalizar(clase.titulo).includes(texto);
      return coincideNivel && coincideTexto;
    });
  }, [busqueda, nivel]);

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top + spacing.md, paddingHorizontal }]}>
      <Text style={styles.titulo}>Aplicación de reservas de clases</Text>
      <View style={styles.buscador}>
        <Ionicons name="search" size={18} color={colors.primario} />
        <TextInput
          style={styles.input}
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Busca una clase o profesor"
          placeholderTextColor={colors.textoSuave}
          autoCorrect={false}
          autoComplete="off"
        />
        {busqueda.length > 0 && (
          <Pressable onPress={() => setBusqueda('')} accessibilityLabel="Limpiar búsqueda">
            <Ionicons name="close-circle" size={18} color={colors.primario} />
          </Pressable>
        )}
      </View>
      <FlatList
        horizontal
        data={NIVELES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <NivelChip etiqueta={item} activo={nivel === item} onPress={() => setNivel(item)} />
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.filtros}
        contentContainerStyle={styles.filtrosContenido}
      />
      <FlatList
        data={resultados}
        key={`clases-${columnas}`}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            clase={item}
            onPress={() => navigation.navigate('DetalleClase', { clase: item })}
          />
        )}
        numColumns={columnas}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl, flexGrow: 1 }}
        columnWrapperStyle={columnas > 1 ? styles.fila : undefined}
        ListEmptyComponent={
          <EstadoVacio
            icono="search-outline"
            titulo="No se encontraron resultados"
            mensaje="Intenta con otra palabra clave."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  titulo: { ...typography.titulo, marginBottom: spacing.lg },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.superficie,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borde,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: { flex: 1, paddingVertical: spacing.sm, marginHorizontal: spacing.sm, color: colors.texto },
  filtros: { flexGrow: 0, marginBottom: spacing.lg },
  filtrosContenido: { paddingRight: spacing.lg },
  fila: { gap: spacing.md },
});
