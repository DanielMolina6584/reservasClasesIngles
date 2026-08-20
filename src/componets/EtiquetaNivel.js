import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function EtiquetaNivel ({nivel}){
    return(
        <view style={styles.contendor}>
            <text style={styles.texto}> {nivel}</text>
        </view>
    )
}

const styles= StyleSheet.create({
    contendor: {
    paddingHorizontal = 2,
    paddingVertical= 3,
    borderRadius: full,
    borderWithe= 1,
},
texto:{ fontSize:11, fontWeight: '700',letterSpacing: 0.3}
})
