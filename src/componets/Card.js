import React from 'react';
import { View, Text, Image, Pressable, StyleSheet} from 'react-native';
import EtiquetaNivel from './EtiquetaNivel';

export default function Card ({urlImagen, omPress, ancho}) {
    return(
        <Pressable
            onPress={onPress}
        >
         <image source={{uri:'La url de la imagen'}} style={} resizeMode='cover'/>   
        </Pressable>
    )
}
