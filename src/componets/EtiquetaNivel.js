import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors, spacing} from '../theme'

export default function EtiquetaNivel ({nivel}){
    return(
        <view style={[styles.contendor, {backgroundColor: colors.fondo}]}>
            <text style={styles.texto}> {nivel}</text>
        </view>
    )
}

const styles= StyleSheet.create({
    contendor: {
        alignSelf: 'auto',
        paddingVertical= 3,
        paddingHorizontal: spacing.md,
        borderWithe= 1,
},
texto:{ fontSize:11, fontWeight: '700',letterSpacing: 0.3}
})
