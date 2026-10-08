import React, {useRef, useState} from 'react';
import {Alert, Keyboard, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CampoFormulario from '../components/CampoFormulario';
import useResponsive from '../hooks/useResponsive';
import useUsuario from '../hooks/useUsuario';
import {colors, radius, spacing, typography} from '../theme';

export default function IniciarSesionScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const {paddingHorizontal} = useResponsive();
    const {iniciarSesion, cargando} = useUsuario();
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const enviandoRef = useRef(false);
    const [verContrasena, setVerContrasena] = useState(false);
    const contrasenaRef = useRef(null);

    const cambiar = (campo, setValor) => (texto) => {
        setValor(texto);
        setErrores((actuales) => ({...actuales, [campo]: undefined, general: undefined}));
    };

    const entrar = async () => {
        if (enviandoRef.current || cargando) {
            return;
        }

        enviandoRef.current = true;
        setEnviando(true);
        try {
            const resultado = await iniciarSesion(correo, contrasena);
            if (!resultado.iniciada) {
                setErrores(resultado.errores);
                return;
            }
            Keyboard.dismiss();
            navigation.goBack();
            Alert.alert('Sesión iniciada', `¡Hola de nuevo, ${resultado.usuario.nombre}!`);
        } catch (error) {
            Alert.alert('Error al iniciar sesión', 'No se pudo iniciar la sesión. Inténtalo de nuevo.');
            console.error('Error iniciando sesión:', error);
        } finally {
            enviandoRef.current = false;
            setEnviando(false);
        }
    };

    const inactivo = enviando || cargando;

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
                        <Ionicons name="log-in-outline" size={32} color={colors.primario}/>
                    </View>
                    <View style={styles.encabezadoTexto}>
                        <Text style={styles.titulo}>Bienvenido de nuevo</Text>
                        <Text style={styles.mensaje}>Ingresa con tu correo y tu contraseña.</Text>
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
                    value={correo}
                    onChangeText={cambiar('correo', setCorreo)}
                    placeholder="nombre@correo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="username"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => contrasenaRef.current?.focus()}
                />
                <CampoFormulario
                    ref={contrasenaRef}
                    etiqueta="Contraseña"
                    error={errores.contrasena}
                    value={contrasena}
                    onChangeText={cambiar('contrasena', setContrasena)}
                    placeholder="Tu contraseña"
                    secureTextEntry={!verContrasena}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={entrar}
                />
                <Pressable
                    style={styles.verContrasena}
                    onPress={() => setVerContrasena((actual) => !actual)}
                    accessibilityRole="button"
                    hitSlop={8}
                >
                    <Ionicons name={verContrasena ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.primario}/>
                    <Text style={styles.textoEnlace}>{verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}</Text>
                </Pressable>

                <Pressable
                    style={({pressed}) => [styles.boton, inactivo && styles.botonDeshabilitado, pressed && styles.botonPresionado]}
                    onPress={entrar}
                    disabled={inactivo}
                    accessibilityRole="button"
                    accessibilityState={{disabled: inactivo, busy: enviando}}
                >
                    <Ionicons name="log-in-outline" size={18} color="#FFFFFF"/>
                    <Text style={styles.textoBoton}>{enviando ? 'Iniciando sesión...' : 'Iniciar sesión'}</Text>
                </Pressable>

                <Pressable
                    style={styles.registro}
                    onPress={() => navigation.replace('Registro')}
                    accessibilityRole="button"
                    hitSlop={8}
                >
                    <Text style={styles.textoRegistro}>¿No tienes cuenta?</Text>
                    <Text style={styles.textoEnlace}>Regístrate</Text>
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
    verContrasena: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.xs,
        marginTop: -spacing.sm,
        marginBottom: spacing.lg,
    },
    textoEnlace: {color: colors.primario, fontSize: 13, fontWeight: '700'},
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
    registro: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        marginTop: spacing.lg,
    },
    textoRegistro: {color: colors.textoSuave, fontSize: 14},
});
