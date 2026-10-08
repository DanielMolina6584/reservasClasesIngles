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

const normalizarCorreo = (correo) => correo.trim().toLowerCase();
const normalizarTelefono = (telefono) => telefono.replace(/[\s().-]/g, '');

export const normalizarRegistro = (datos) => ({
    nombre: datos.nombre.trim().replace(/\s+/g, ' '),
    apellido: datos.apellido.trim().replace(/\s+/g, ' '),
    correo: normalizarCorreo(datos.correo),
    telefono: normalizarTelefono(datos.telefono),
    foto: datos.foto.trim(),
    contrasena: datos.contrasena,
    confirmacion: datos.confirmacion,
});

const mismoTelefono = (a, b) => a.replace(/^\+/, '') === b.replace(/^\+/, '');

const validarCorreo = (correo) => {
    if (!correo) {
        return 'Ingresa tu correo electrónico.';
    }
    if (!CORREO_VALIDO.test(correo)) {
        return 'Ingresa un correo válido, por ejemplo nombre@correo.com.';
    }
    return null;
};

const validarTelefono = (telefono) => {
    if (!telefono) {
        return 'Ingresa tu teléfono.';
    }
    if (!TELEFONO_VALIDO.test(telefono)) {
        return 'Ingresa un teléfono válido (de 7 a 15 dígitos).';
    }
    return null;
};

// Agrega a `errores` los campos que ya usa otra cuenta. `idPropio` excluye la cuenta que se está editando.
const marcarRepetidos = (errores, usuarios, {correo, telefono}, idPropio = null) => {
    const otras = usuarios.filter((item) => item && item.id !== idPropio);
    if (!errores.correo && otras.some((item) => item.correo === correo)) {
        errores.correo = 'Este correo ya está registrado en otra cuenta.';
    }
    if (!errores.telefono && otras.some((item) => typeof item.telefono === 'string' && mismoTelefono(item.telefono, telefono))) {
        errores.telefono = 'Este teléfono ya está registrado en otra cuenta.';
    }
};

const soloConError = (errores) => Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje));

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
        correo: validarCorreo(datos.correo),
        telefono: validarTelefono(datos.telefono),
        foto: datos.foto && !FOTO_VALIDA.test(datos.foto)
            ? 'La foto debe ser un enlace que empiece por http:// o https://.'
            : null,
        contrasena: validarContrasena(datos.contrasena),
        confirmacion: !datos.confirmacion
            ? 'Confirma tu contraseña.'
            : datos.confirmacion !== datos.contrasena ? 'Las contraseñas no coinciden.' : null,
    };
    return soloConError(errores);
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
        marcarRepetidos(errores, usuarios, perfil);
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
        const correoNormalizado = normalizarCorreo(correo);
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

    // Cambia únicamente el correo y el teléfono de la cuenta con sesión. La cuenta se busca por `id`
    // (no por correo, que es lo que cambia). Devuelve {actualizado, errores, correoCambiado}.
    const actualizarContacto = useCallback(async (datos) => {
        if (!usuario) {
            return {actualizado: false, errores: {general: 'Inicia sesión para actualizar tus datos.'}, correoCambiado: false};
        }
        const cuenta = usuarios.find((item) => item?.id === usuario.id);
        if (!cuenta) {
            await cerrarSesion();
            return {actualizado: false, errores: {general: 'No encontramos tu cuenta. Inicia sesión de nuevo.'}, correoCambiado: false};
        }

        const contacto = {
            correo: normalizarCorreo(datos.correo),
            telefono: normalizarTelefono(datos.telefono),
        };
        const errores = soloConError({
            correo: validarCorreo(contacto.correo),
            telefono: validarTelefono(contacto.telefono),
        });
        marcarRepetidos(errores, usuarios, contacto, cuenta.id);
        if (Object.keys(errores).length > 0) {
            return {actualizado: false, errores, correoCambiado: false};
        }
        if (contacto.correo === cuenta.correo && contacto.telefono === cuenta.telefono) {
            return {actualizado: false, errores: {general: 'No hiciste cambios.'}, correoCambiado: false};
        }

        const actualizadoEn = new Date().toISOString();
        await actualizarUsuarios(usuarios.map((item) => (
            item?.id === cuenta.id ? {...cuenta, ...contacto, actualizadoEn} : item
        )));
        try {
            await actualizarSesion({...usuario, ...contacto, actualizadoEn});
        } catch (error) {
            // Sin esto la cuenta tendría los datos nuevos y la sesión los viejos.
            await actualizarUsuarios(usuarios).catch(() => {});
            throw error;
        }
        return {actualizado: true, errores: {}, correoCambiado: contacto.correo !== cuenta.correo};
    }, [actualizarSesion, actualizarUsuarios, cerrarSesion, usuario, usuarios]);

    const contexto = useMemo(() => ({
        usuario,
        cargando,
        sesionIniciada,
        guardarSesion,
        cerrarSesion,
        registrarUsuario,
        iniciarSesion,
        actualizarContacto,
    }), [actualizarContacto, cargando, cerrarSesion, guardarSesion, iniciarSesion, registrarUsuario, sesionIniciada, usuario]);

    return (
        <UsuarioContext.Provider value={contexto}>
            {children}
        </UsuarioContext.Provider>
    );
}
