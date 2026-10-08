import React, {createContext, useCallback, useMemo} from 'react';
import useAlmacenamiento from '../hooks/useAlmacenamiento';

const CLAVE_SESION = '@usuario_sesion';
const CLAVE_USUARIOS = '@usuarios_ingles';

const NOMBRE_VALIDO = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO_VALIDO = /^\+?\d{7,15}$/;
export const FOTO_VALIDA = /^https?:\/\/\S+$/i;

const crearId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const normalizarRegistro = (datos) => ({
    nombre: datos.nombre.trim().replace(/\s+/g, ' '),
    apellido: datos.apellido.trim().replace(/\s+/g, ' '),
    correo: datos.correo.trim().toLowerCase(),
    telefono: datos.telefono.replace(/[\s().-]/g, ''),
    foto: datos.foto.trim(),
});

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

    // Guarda la cuenta en @usuarios_ingles y deja la sesión iniciada con ella.
    const registrarUsuario = useCallback(async (datos) => {
        const datosNormalizados = normalizarRegistro(datos);
        const errores = validarRegistro(datosNormalizados);
        if (!errores.correo && usuarios.some((item) => item.correo === datosNormalizados.correo)) {
            errores.correo = 'Ya existe una cuenta con este correo.';
        }
        if (Object.keys(errores).length > 0) {
            return {registrado: false, errores};
        }

        const nuevoUsuario = {
            id: crearId(),
            ...datosNormalizados,
            foto: datosNormalizados.foto || null,
            creadoEn: new Date().toISOString(),
        };
        await actualizarUsuarios([...usuarios, nuevoUsuario]);
        try {
            await actualizarSesion(nuevoUsuario);
        } catch (error) {
            // Sin esto la cuenta quedaría guardada sin sesión y el reintento diría "Ya existe una cuenta".
            await actualizarUsuarios(usuarios).catch(() => {});
            throw error;
        }
        return {registrado: true, errores: {}};
    }, [actualizarSesion, actualizarUsuarios, usuarios]);

    const contexto = useMemo(() => ({
        usuario,
        cargando,
        sesionIniciada,
        guardarSesion,
        cerrarSesion,
        registrarUsuario,
    }), [cargando, cerrarSesion, guardarSesion, registrarUsuario, sesionIniciada, usuario]);

    return (
        <UsuarioContext.Provider value={contexto}>
            {children}
        </UsuarioContext.Provider>
    );
}
