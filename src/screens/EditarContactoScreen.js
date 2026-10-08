import React, {useEffect, useRef, useState} from 'react';
import {Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CampoFormulario from '../components/CampoFormulario';
import useResponsive from '../hooks/useResponsive';
import useUsuario from '../hooks/useUsuario';
import {colors, radius, spacing, typography} from '../theme';

// Solo permite cambiar el correo y el teléfono del usuario con sesión.
export default function EditarContactoScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const {paddingHorizontal} = useResponsive();
    const {usuario, sesionIniciada, cargando, actualizarContacto} = useUsuario();
    const [correo, setCorreo] = useState(usuario?.correo ?? '');
    const [telefono, setTelefono] = useState(usuario?.telefono ?? '');
    const [errores, setErrores] = useState({});
    const [guardando, setGuardando] = useState(false);
    const guardandoRef = useRef(false);
    const telefonoRef = useRef(null);

    // Si la sesión se cierra con la pantalla abierta, no hay nada que editar.
    useEffect(() => {
        if (!cargando && !sesionIniciada && navigation.canGoBack()) {
            navigation.goBack();
        }
    }, [cargando, navigation, sesionIniciada]);

    const cambiar = (campo, setValor) => (texto) => {
        setValor(texto);
        setErrores((actuales) => ({...actuales, [campo]: undefined, general: undefined}));
    };

    const guardar = async () => {
        if (guardandoRef.current || cargando) {
            return;
        }

        guardandoRef.current = true;
        setGuardando(true);
        try {
            const resultado = await actualizarContacto({correo, telefono});
            if (!resultado.actualizado) {
                setErrores(resultado.errores);
                return;
            }
            Keyboard.dismiss();
            navigation.goBack();
            Alert.alert(
                'Datos actualizados',
                resultado.correoCambiado
                    ? 'Tus datos de contacto se guardaron. Desde ahora inicia sesión con tu correo nuevo.'
                    : 'Tus datos de contacto se guardaron.',
            );
        } catch (error) {
            Alert.alert('Error al guardar', 'No se pudieron actualizar tus datos. Inténtalo de nuevo.');
            console.error('Error actualizando los datos de contacto:', error);
        } finally {
            guardandoRef.current = false;
            setGuardando(false);
        }
    };

    const inactivo = guardando || cargando || !sesionIniciada;

    return (
        <ScrollView
            style={styles.pantalla}
            contentContainerStyle={{paddingHorizontal, paddingTop: spacing.xl, paddingBottom: insets.bottom + spacing.xl}}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
        >
            <View style={styles.contenido}>
                <View style={styles.encabezado}>
                    <View style={styles.circulo}>
                        <Ionicons name="call-outline" size={30} color={colors.primario}/>
                    </View>
                    <View style={styles.encabezadoTexto}>
                        <Text style={styles.titulo}>Datos de contacto</Text>
                        <Text style={styles.mensaje}>Actualiza tu correo electrónico y tu teléfono.</Text>
                    </View>
                </View>

                {errores.general ? (
                    <View style={styles.errorGeneral} accessibilityRole="alert">
                        <Ionicons name="alert-circle-outline" size={18} color={colors.peligro}/>
                        <Text style={styles.textoErrorGeneral}>{errores.general}</Text>
                    </View>
                ) : null}

                <CampoFormulario
                    etiqueta="Correo electrónico"
                    error={errores.correo}
                    ayuda="Es el correo con el que inicias sesión."
                    value={correo}
                    onChangeText={cambiar('correo', setCorreo)}
                    placeholder="nombre@correo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => telefonoRef.current?.focus()}
                />
                <CampoFormulario
                    ref={telefonoRef}
                    etiqueta="Teléfono"
                    error={errores.telefono}
                    value={telefono}
                    onChangeText={cambiar('telefono', setTelefono)}
                    placeholder="+57 300 123 4567"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    returnKeyType="done"
                    onSubmitEditing={guardar}
                />

                <Pressable
                    style={({pressed}) => [styles.boton, inactivo && styles.botonDeshabilitado, pressed && styles.botonPresionado]}
                    onPress={guardar}
                    disabled={inactivo}
                    accessibilityRole="button"
                    accessibilityState={{disabled: inactivo, busy: guardando}}
                >
                    <Ionicons name="save-outline" size={18} color="#FFFFFF"/>
                    <Text style={styles.textoBoton}>{guardando ? 'Guardando...' : 'Guardar cambios'}</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    pantalla: {flex: 1, backgroundColor: colors.fondo},
    contenido: {width: '100%', maxWidth: 520, alignSelf: 'center'},
    encabezado: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl},
    encabezadoTexto: {flex: 1},
    circulo: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primarioSuave,
        borderWidth: 1,
        borderColor: colors.borde,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titulo: {...typography.titulo},
    mensaje: {color: colors.textoSuave, fontSize: 14, lineHeight: 20, marginTop: spacing.xs},
    errorGeneral: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.peligro,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    textoErrorGeneral: {flex: 1, color: colors.peligro, fontSize: 13, fontWeight: '600'},
    boton: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primario,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
    },
    botonDeshabilitado: {opacity: 0.6},
    botonPresionado: {opacity: 0.8},
    textoBoton: {color: '#FFFFFF', fontWeight: '800'},
});
