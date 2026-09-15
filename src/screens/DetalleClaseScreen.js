import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "../theme";

export default function DetalleClaseScreen({ route }) {
  const { clase } = route.params;

  return (
    <View style={styles.pantalla}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: clase.imagen }}
          resizeMode="cover"
          style={styles.portada}
        />
      </ScrollView>
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
});
