import React, {createContext, useCallback, useMemo} from 'react';
import useAlmacenamiento from '../hooks/useAlmacenamiento';

const CLAVE_SESION = '@usuario_sesion';
const CLAVE_USUARIOS = '@usuarios_ingles';

const NOMBRE_VALIDO = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO_VALIDO = /^\+?\d{7,15}$/;
export const FOTO_VALIDA = /^https?:\/\/\S+$/i;
const LETRA = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const CREDENCIALES_INCORRECTAS = 'Correo o contraseña incorrectos.';

const crearId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizarRegistro = (datos) => ({
    nombre: datos.nombre.trim().replace(/\s+/g, ' '),
    apellido: datos.apellido.trim().replace(/\s+/g, ' '),
    correo: datos.correo.trim().toLowerCase(),
    telefono: datos.telefono.replace(/[\s().-]/g, ''),
    foto: datos.foto.trim(),
    contrasena: datos.contrasena,
    confirmacion: datos.confirmacion,
});

const mismoTelefono = (a, b) => a.replace(/^\+/, '') === b.replace(/^\+/, '');

const validarNombre = (valor, campo) => {
    if (!valor) {
        return `Ingresa tu ${campo}.`;
    }
    if (valor.length < 2) {
        return `El ${campo} debe tener al menos 2 letras.`;
    }
    if (!NOMBRE_VALIDO.test(valor)) {
        return `El ${campo} solo puede tener letras.`;
    }
    return null;
};

const validarContrasena = (contrasena) => {
    if (!contrasena) {
        return 'Crea una contraseña.';
    }
    if (/\s/.test(contrasena)) {
        return 'La contraseña no puede tener espacios.';
    }
    if (contrasena.length < 8 || contrasena.length > 64) {
        return 'La contraseña debe tener entre 8 y 64 caracteres.';
    }
    if (!LETRA.test(contrasena) || !/\d/.test(contrasena)) {
        return 'La contraseña debe tener al menos una letra y un número.';
    }
    return null;
};

// Recibe datos normalizados y devuelve solo los campos con error: {campo: mensaje}.
export function validarRegistro(datos) {
    const errores = {
        nombre: validarNombre(datos.nombre, 'nombre'),
        apellido: validarNombre(datos.apellido, 'apellido'),
        correo: !datos.correo
            ? 'Ingresa tu correo electrónico.'
            : !CORREO_VALIDO.test(datos.correo) ? 'Ingresa un correo válido, por ejemplo nombre@correo.com.' : null,
        telefono: !datos.telefono
            ? 'Ingresa tu teléfono.'
            : !TELEFONO_VALIDO.test(datos.telefono) ? 'Ingresa un teléfono válido (de 7 a 15 dígitos).' : null,
        foto: datos.foto && !FOTO_VALIDA.test(datos.foto)
            ? 'La foto debe ser un enlace que empiece por http:// o https://.'
            : null,
        contrasena: validarContrasena(datos.contrasena),
        confirmacion: !datos.confirmacion
            ? 'Confirma tu contraseña.'
            : datos.confirmacion !== datos.contrasena ? 'Las contraseñas no coinciden.' : null,
    };
    return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));
}

export const UsuarioContext = createContext(null);

export function UsuarioProvider({children}) {
    const {
        valor,
        actualizar: actualizarSesion,
        listo,
    } = useAlmacenamiento(CLAVE_SESION, null);
    const {
        valor: usuarios,
        actualizar: actualizarUsuarios,
        listo: usuariosListos,
    } = useAlmacenamiento(CLAVE_USUARIOS, []);
    const cargando = !listo || !usuariosListos;
    const usuario = valor && typeof valor === 'object' ? valor : null;
    const sesionIniciada = usuario !== null;

    const guardarSesion = useCallback((datosUsuario) => actualizarSesion(datosUsuario), [actualizarSesion]);
    const cerrarSesion = useCallback(() => actualizarSesion(null), [actualizarSesion]);

    const registrarUsuario = useCallback(async (datos) => {
        const datosNormalizados = normalizarRegistro(datos);
        const errores = validarRegistro(datosNormalizados);
        const {contrasena, confirmacion, ...perfil} = datosNormalizados;
        if (!errores.correo && usuarios.some((item) => item?.correo === perfil.correo)) {
            errores.correo = 'Este correo ya está registrado en otra cuenta.';
        }
        if (!errores.telefono && usuarios.some((item) => typeof item?.telefono === 'string' && mismoTelefono(item.telefono, perfil.telefono))) {
            errores.telefono = 'Este teléfono ya está registrado en otra cuenta.';
        }
        if (Object.keys(errores).length > 0) {
            return {registrado: false, errores};
        }

        const sesion = {
            id: crearId(),
            ...perfil,
            foto: perfil.foto || null,
            creadoEn: new Date().toISOString(),
        };
        const nuevoUsuario = {...sesion, contrasena};
        await actualizarUsuarios([...usuarios, nuevoUsuario]);
        try {
            await actualizarSesion(sesion);
        } catch (error) {
            // Sin esto la cuenta quedaría guardada sin sesión y el reintento diría "Ya existe una cuenta".
            await actualizarUsuarios(usuarios).catch(() => {});
            throw error;
        }
        return {registrado: true, errores: {}};
    }, [actualizarSesion, actualizarUsuarios, usuarios]);

    // El usuario es el correo. Si el correo no existe o la contraseña no coincide se responde lo mismo,
    // para no revelar qué correos están registrados. Las cuentas sin contraseña (anteriores a la #012) no pueden entrar.
    const iniciarSesion = useCallback(async (correo, contrasena) => {
        const correoNormalizado = correo.trim().toLowerCase();
        const errores = {};
        if (!correoNormalizado) {
            errores.correo = 'Ingresa tu correo electrónico.';
        }
        if (!contrasena) {
            errores.contrasena = 'Ingresa tu contraseña.';
        }
        if (Object.keys(errores).length > 0) {
            return {iniciada: false, errores, usuario: null};
        }

        const cuenta = usuarios.find((item) => item?.correo === correoNormalizado);
        if (!cuenta || typeof cuenta.contrasena !== 'string' || cuenta.contrasena !== contrasena) {
            return {iniciada: false, errores: {general: CREDENCIALES_INCORRECTAS}, usuario: null};
        }

        const {contrasena: _contrasena, ...sesion} = cuenta;
        await actualizarSesion(sesion);
        return {iniciada: true, errores: {}, usuario: sesion};
    }, [actualizarSesion, usuarios]);

    const contexto = useMemo(() => ({
        usuario,
        cargando,
        sesionIniciada,
        guardarSesion,
        cerrarSesion,
        registrarUsuario,
        iniciarSesion,
    }), [cargando, cerrarSesion, guardarSesion, iniciarSesion, registrarUsuario, sesionIniciada, usuario]);

    return (
        <UsuarioContext.Provider value={contexto}>
            {children}
        </UsuarioContext.Provider>
    );
}
