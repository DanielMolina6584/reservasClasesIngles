import React, {useRef} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useScrollToTop} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SesionRequerida from '../components/SesionRequerida';
import useResponsive from '../hooks/useResponsive';
import useUsuario from '../hooks/useUsuario';
import {colors, radius, spacing, typography} from '../theme';

export default function PerfilScreen() {
    const insets = useSafeAreaInsets();
    const {paddingHorizontal} = useResponsive();
    const {usuario, cargando, sesionIniciada, cerrarSesion} = useUsuario();
    const scrollRef = useRef(null);
    useScrollToTop(scrollRef);

    let contenido;
    if (cargando) {
        contenido = <ActivityIndicator size="large" color={colors.primario} style={styles.cargando}/>;
    } else if (sesionIniciada) {
        contenido = <PerfilConSesion usuario={usuario} onCerrarSesion={cerrarSesion}/>;
    } else {
        contenido = (
            <SesionRequerida
                icono="person-outline"
                titulo="Aún no has iniciado sesión"
                mensaje="Inicia sesión o crea una cuenta para reservar tus clases de inglés y consultar tus reservas."
            />
        );
    }

    return (
        <ScrollView
            ref={scrollRef}
            style={styles.pantalla}
            contentContainerStyle={{paddingTop: insets.top + spacing.md, paddingHorizontal, paddingBottom: spacing.xl}}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.contenido}>
                <Text style={styles.titulo}>Mi perfil</Text>
                {contenido}
            </View>
        </ScrollView>
    );
}

// Vista preparada para el usuario con sesión. Los datos y acciones del perfil se agregan en la siguiente etapa.
function PerfilConSesion({usuario, onCerrarSesion}) {
    const nombreCompleto = [usuario.nombre, usuario.apellido].filter(Boolean).join(' ');
    const iniciales = [usuario.nombre, usuario.apellido]
        .map((texto) => texto?.trim()[0] ?? '')
        .join('')
        .toUpperCase();

    return (
        <View style={styles.tarjeta}>
            <View style={[styles.avatar, styles.avatarConSesion]}>
                {iniciales ? (
                    <Text style={styles.iniciales}>{iniciales}</Text>
                ) : (
                    <Ionicons name="person" size={36} color="#FFFFFF"/>
                )}
            </View>
            <View style={styles.estado}>
                <Ionicons name="checkmark-circle" size={16} color={colors.primario}/>
                <Text style={styles.textoEstado}>Sesión iniciada</Text>
            </View>
            <Text style={styles.nombre}>{nombreCompleto || 'Estudiante'}</Text>
            {usuario.correo ? <Text style={styles.mensaje}>{usuario.correo}</Text> : null}
            <View style={styles.acciones}>
                <Pressable
                    style={({pressed}) => [styles.boton, styles.botonSecundario, pressed && styles.botonPresionado]}
                    onPress={onCerrarSesion}
                    accessibilityRole="button"
                >
                    <Ionicons name="log-out-outline" size={18} color={colors.primario}/>
                    <Text style={[styles.textoBoton, styles.textoBotonSecundario]}>Cerrar sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: {flex: 1, backgroundColor: colors.fondo},
    // En tablet la tarjeta no se estira a todo el ancho.
    contenido: {width: '100%', maxWidth: 520, alignSelf: 'center'},
    titulo: {...typography.titulo, marginBottom: spacing.lg},
    cargando: {marginTop: spacing.xxl},
    tarjeta: {
        alignItems: 'center',
        backgroundColor: colors.superficie,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.borde,
        padding: spacing.xl,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primarioSuave,
        borderWidth: 1,
        borderColor: colors.borde,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarConSesion: {backgroundColor: colors.primario, borderColor: colors.primario},
    iniciales: {color: '#FFFFFF', fontSize: 28, fontWeight: '800'},
    estado: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primarioSuave,
        borderRadius: radius.full,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        marginTop: spacing.lg,
    },
    textoEstado: {color: colors.primario, fontSize: 12, fontWeight: '700'},
    nombre: {
        color: colors.texto,
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        marginTop: spacing.md,
    },
    mensaje: {
        color: colors.textoSuave,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    acciones: {alignSelf: 'stretch', gap: spacing.md, marginTop: spacing.xl},
    boton: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primario,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.primario,
        paddingHorizontal: spacing.lg,
    },
    botonSecundario: {backgroundColor: colors.superficie},
    botonPresionado: {opacity: 0.8},
    textoBoton: {color: '#FFFFFF', fontWeight: '800'},
    textoBotonSecundario: {color: colors.primario},
});
