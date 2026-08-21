import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from './src/componets/Card';
import { CLASES } from './src/data/clases';
import { colors, spacing, typography } from './src/theme';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Reserva tu clase de inglés</Text>
      <Text style={styles.subtitulo}>Elige un profesor, horario y precio</Text>

      {CLASES.map((clase) => (
        <Card key={clase.id} clase={clase} />
      ))}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    backgroundColor: colors.fondo,
  },
  titulo: {
    ...typography.titulo,
    marginBottom: spacing.xs,
  },
  subtitulo: {
    ...typography.secundario,
    marginBottom: spacing.xl,
  },
});
