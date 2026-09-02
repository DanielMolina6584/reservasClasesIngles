import React from 'react';
import {View, Text, Image, Pressable, StyleSheet, TextInput, ScrollView} from 'react-native';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';

import EtiquetaNivel from '../componets/EtiquetaNivel';
import NivelChip from '../componets/NivelChip'; 
import { colors, radius, spacing, typography } from '../theme';
import {formatearPrecio, CLASES, NIVELES} from '../data/clases';

export default function ClasesScreen ({navigation}) {
    const insets =useSafeAreaInsets();
    const [nivel, setNivel] = useState()
    const [busqueda, setBusqueda] = useState('')

    return(
        <view style ={[style.pantalla, {paddingTop: insets.top + spacing.md}]}
                   
        
        >
            <View>
                <Text>Aplicación para clases de Ingles</Text>
                <Ionicons name="search" size={18} color={colors.textoSuave} />
                <TextInput
                    placeholder="Buscar por nivel"
                    value={busqueda}
                    onChangeText={setBusqueda}
                    autoCorrect={false}
                />
                {
                    busqueda.length > 0 && (
                    <Ionicons 
                    name='close-circle' 
                    size={18}
                    color={colors.textoSuave} 
                    onPress={() => setBusqueda('')}
                    />)
                }
            </View>
            <ScrollView
            style={{flexgrow: 0}}
            horizontal
            >
                {NIVELES.map((item) => (
                    <NivelChip
                        etiqueta={item}
                        activo={item}
                        onPress={() => setNivel(item)}
                    />
                ))}
            </ScrollView>
        </view>
    )

}