import { Platform } from "react-native";

export const colors = {
    fondo: '#f1e3e3',
    superficie: '#dbeafe',
    texto: '#000000',
    textoSuave: '#6b7280',
    border: 'rgb(130, 130, 215)',
    borde: 'rgb(130, 130, 215)',
    primario: '#6C5CE7',
    background: '#8d8d8d',
}
export const spacing = {
    xs:4,
    sm:8,
    md:12,
    lg:16,
    xl:18
}

export const radius = {
    sm:8,
    md:14,
    lg:20,
    full: 999
}

export const typhography = {
    titulo: { fontSize: 20, fontWeight: '800', color: colors.texto },
}

export default {colors, spacing, radius, typhography}