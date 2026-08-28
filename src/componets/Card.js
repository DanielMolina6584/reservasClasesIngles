import React from 'react';
import{View,Text,Image,Pressable, Stylesheet}from 'react-native'
import EtiquetaNivel from './EtiquetaNivel';
import {colors,radius,spacing,typography} from '.../theme';
import { formatearPrecio } from '../data/clases';
 
 
export default function Card ({urlimagen,onpress,ancho}){
 
return(
<Pressable
   onpress={onpress}
>
 
<image source={{uri:clase.image}}/>
   <view>
      <EtiquetaNivel nivel={clase.nivel}/>
   </view>
    <view>
      <text> {clase.profesor}</text>
    </view>
   
 
</Pressable>
 
)
}
 
const style = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  imagen: {
    width: '100%',
    height: 130,
    backgroundColor: colors.primarioSuave,
  },
  cuerpo: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  titulo: { fontSize: 16, fontWeight: '700', color: colors.texto },
  filaProfesor: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.borde },
  profesor: { fontSize: 13, color: colors.textoSuave, flexShrink: 1 },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  filaCentro: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { fontSize: 12, color: colors.textoSuave },
  punto: { color: colors.borde, marginHorizontal: 2 },
  precio: { fontSize: 14, fontWeight: '800', color: colors.primario },
});