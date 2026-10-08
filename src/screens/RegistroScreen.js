import React, {useRef, useState} from 'react';
import {Alert, Image, Keyboard, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CampoFormulario from '../components/CampoFormulario';
import {FOTO_VALIDA} from '../context/UsuarioContext';
import useResponsive from '../hooks/useResponsive';
import useUsuario from '../hooks/useUsuario';
import {colors, radius, spacing, typography} from '../theme';

const DATOS_VACIOS = {nombre: '', apellido: '', correo: '', telefono: '', contrasena: '', confirmacion: '', foto: ''};

export default function RegistroScreen({navigation}) {
    const insets = useSafeAreaInsets();
    const {paddingHorizontal, esTablet} = useResponsive();
    const {registrarUsuario, cargando} = useUsuario();
    const [datos, setDatos] = useState(DATOS_VACIOS);
    const [errores, setErrores] = useState({});
    const [enviando, setEnviando] = useState(false);
    const enviandoRef = useRef(false);
    const [fotoPrevia, setFotoPrevia] = useState('');
    const [fotoFallida, setFotoFallida] = useState(null);
    const [verContrasena, setVerContrasena] = useState(false);
    const apellidoRef = useRef(null);
    const correoRef = useRef(null);
    const telefonoRef = useRef(null);
    const contrasenaRef = useRef(null);
    const confirmacionRef = useRef(null);
    const fotoRef = useRef(null);

    const cambiar = (campo) => (texto) => {
        setDatos((actuales) => ({...actuales, [campo]: texto}));
        setErrores((actuales) => ({
            ...actuales,
            [campo]: undefined,
            ...(campo === 'contrasena' && {confirmacion: undefined}),
        }));
    };

    const registrar = async () => {
        if (enviandoRef.current || cargando) {
            return;
        }

        enviandoRef.current = true;
        setEnviando(true);
        try {
            const resultado = await registrarUsuario(datos);
            if (!resultado.registrado) {
                setErrores(resultado.errores);
                return;
            }
            Keyboard.dismiss();
            navigation.goBack();
            Alert.alert('Cuenta creada', `¡Te damos la bienvenida, ${datos.nombre.trim()}!`);
        } catch (error) {
            Alert.alert('Error al registrarse', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
            console.error('Error registrando el usuario:', error);
        } finally {
            enviandoRef.current = false;
            setEnviando(false);
        }
    };

    const mostrarFoto = FOTO_VALIDA.test(fotoPrevia) && fotoPrevia !== fotoFallida;
    const iniciales = `${datos.nombre.trim()[0] ?? ''}${datos.apellido.trim()[0] ?? ''}`.toUpperCase();
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
                    {mostrarFoto ? (
                        <Image
                            source={{uri: fotoPrevia}}
                            style={styles.avatar}
                            onError={() => setFotoFallida(fotoPrevia)}
                            accessibilityLabel="Vista previa de la foto de perfil"
                        />
                    ) : (
                        <View style={styles.avatar}>
                            {iniciales ? (
                                <Text style={styles.iniciales}>{iniciales}</Text>
                            ) : (
                                <Ionicons name="person-outline" size={32} color={colors.primario}/>
                            )}
                        </View>
                    )}
                    <View style={styles.encabezadoTexto}>
                        <Text style={styles.titulo}>Crea tu cuenta</Text>
                        <Text style={styles.mensaje}>Completa tus datos para registrarte.</Text>
                    </View>
                </View>

                <View style={esTablet ? styles.fila : null}>
                    <CampoFormulario
                        estilo={esTablet ? styles.campoEnFila : null}
                        etiqueta="Nombre"
                        error={errores.nombre}
                        value={datos.nombre}
                        onChangeText={cambiar('nombre')}
                        placeholder="Tu nombre"
                        autoCapitalize="words"
                        autoComplete="given-name"
                        textContentType="givenName"
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => apellidoRef.current?.focus()}
                    />
                    <CampoFormulario
                        ref={apellidoRef}
                        estilo={esTablet ? styles.campoEnFila : null}
                        etiqueta="Apellido"
                        error={errores.apellido}
                        value={datos.apellido}
                        onChangeText={cambiar('apellido')}
                        placeholder="Tu apellido"
                        autoCapitalize="words"
                        autoComplete="family-name"
                        textContentType="familyName"
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => correoRef.current?.focus()}
                    />
                </View>
                <CampoFormulario
                    ref={correoRef}
                    etiqueta="Correo electrónico"
                    error={errores.correo}
                    value={datos.correo}
                    onChangeText={cambiar('correo')}
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
                    value={datos.telefono}
                    onChangeText={cambiar('telefono')}
                    placeholder="+57 300 123 4567"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    textContentType="telephoneNumber"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => contrasenaRef.current?.focus()}
                />
                <CampoFormulario
                    ref={contrasenaRef}
                    etiqueta="Contraseña"
                    error={errores.contrasena}
                    ayuda="Mínimo 8 caracteres, con al menos una letra y un número."
                    value={datos.contrasena}
                    onChangeText={cambiar('contrasena')}
                    placeholder="Crea una contraseña"
                    secureTextEntry={!verContrasena}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => confirmacionRef.current?.focus()}
                />
                <CampoFormulario
                    ref={confirmacionRef}
                    etiqueta="Confirmar contraseña"
                    error={errores.confirmacion}
                    value={datos.confirmacion}
                    onChangeText={cambiar('confirmacion')}
                    placeholder="Escribe de nuevo la contraseña"
                    secureTextEntry={!verContrasena}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={() => fotoRef.current?.focus()}
                />
                <Pressable
                    style={styles.verContrasena}
                    onPress={() => setVerContrasena((actual) => !actual)}
                    accessibilityRole="button"
                    hitSlop={8}
                >
                    <Ionicons name={verContrasena ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.primario}/>
                    <Text style={styles.textoVerContrasena}>{verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}</Text>
                </Pressable>
                <CampoFormulario
                    ref={fotoRef}
                    etiqueta="Foto de perfil (opcional)"
                    error={errores.foto}
                    ayuda="Pega el enlace de una imagen. Se mostrará en el círculo de arriba."
                    value={datos.foto}
                    onChangeText={cambiar('foto')}
                    onBlur={() => setFotoPrevia(datos.foto.trim())}
                    placeholder="https://..."
                    keyboardType="url"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={registrar}
                />

                <Pressable
                    style={({pressed}) => [styles.boton, inactivo && styles.botonDeshabilitado, pressed && styles.botonPresionado]}
                    onPress={registrar}
                    disabled={inactivo}
                    accessibilityRole="button"
                    accessibilityState={{disabled: inactivo, busy: enviando}}
                >
                    <Ionicons name="person-add-outline" size={18} color="#FFFFFF"/>
                    <Text style={styles.textoBoton}>{enviando ? 'Creando cuenta...' : 'Crear cuenta'}</Text>
                </Pressable>

                <Pressable
                    style={styles.iniciarSesion}
                    onPress={() => navigation.replace('IniciarSesion')}
                    accessibilityRole="button"
                    hitSlop={8}
                >
                    <Text style={styles.textoIniciarSesion}>¿Ya tienes cuenta?</Text>
                    <Text style={styles.textoVerContrasena}>Inicia sesión</Text>
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
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primarioSuave,
        borderWidth: 1,
        borderColor: colors.borde,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iniciales: {color: colors.primario, fontSize: 26, fontWeight: '800'},
    titulo: {...typography.titulo},
    mensaje: {color: colors.textoSuave, fontSize: 14, lineHeight: 20, marginTop: spacing.xs},
    fila: {flexDirection: 'row', gap: spacing.md},
    campoEnFila: {flex: 1},
    verContrasena: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.xs,
        marginTop: -spacing.sm,
        marginBottom: spacing.lg,
    },
    textoVerContrasena: {color: colors.primario, fontSize: 13, fontWeight: '700'},
    iniciarSesion: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        marginTop: spacing.lg,
    },
    textoIniciarSesion: {color: colors.textoSuave, fontSize: 14},
    boton: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.primario,
        borderRadius: radius.md,
        paddingHorizontal: spacing.lg,
        marginTop: spacing.sm,
    },
    botonDeshabilitado: {opacity: 0.5},
    botonPresionado: {opacity: 0.8},
    textoBoton: {color: '#FFFFFF', fontWeight: '800'},
});
