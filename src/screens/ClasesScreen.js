import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Pressable, ScrollView, TextInput} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';

import EtiquetaNivel from '../componets/EtiquetaNivel';
import NivelChip from '../componets/NivelChip';
import {spacing, colors, typhography, radius} from '../theme';
import {formatearPrecio, CLASES, NIVELES} from '../data/clases';


export default function ClasesScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const [nivel, setNivel] = useState();
    const [busqueda, setBusqueda] = useState('');

    return (
        <View style={[style.pantalla, {paddingTop: insets.top + spacing.md}]}>
                <View>
                    <Text style={typhography.titulo}>Aplicación de reservas de clases</Text>

                    <View style={style.buscador}>
                        <Ionicons name="search" size={18} color={colors.texto} />
                        <TextInput
                            style={style.input}
                            value={busqueda}
                            onChangeText={setBusqueda}
                            placeholder="ingrese el nombre de la clase"
                            autoCorrect={false}
                            autoComplete="off"
                        />

                        {busqueda.length > 0 && (
                            <Ionicons name="close-circle" size={18} color={colors.texto} onPress={() => setBusqueda('')} />
                        )}
                    </View>
                </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{flexGrow:0}}    
            >
                {
                    NIVELES.map((item) => (
                        <NivelChip
                        key={item}
                        etiqueta={item}
                        activo={nivel === item}
                        onPress={() => setNivel(item)}
                        />
                    ))
                }

            </ScrollView>
        </View>
    
    )}

    const style = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colors.fondo },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 46,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: { flex: 1, fontSize: 14, color: colors.texto, paddingVertical: 0 },
});