import React, {createContext, useCallback, useMemo} from 'react';
import useAlmacenamiento from '../hooks/useAlmacenamiento';

const CLAVE_SESION = '@usuario_sesion';

export const UsuarioContext = createContext(null);

export function UsuarioProvider({children}) {
    const {
        valor,
        actualizar: actualizarSesion,
        listo,
    } = useAlmacenamiento(CLAVE_SESION, null);
    const cargando = !listo;
    const usuario = valor && typeof valor === 'object' ? valor : null;
    const sesionIniciada = usuario !== null;

    const guardarSesion = useCallback((datosUsuario) => actualizarSesion(datosUsuario), [actualizarSesion]);
    const cerrarSesion = useCallback(() => actualizarSesion(null), [actualizarSesion]);

    const contexto = useMemo(() => ({
        usuario,
        cargando,
        sesionIniciada,
        guardarSesion,
        cerrarSesion,
    }), [cargando, cerrarSesion, guardarSesion, sesionIniciada, usuario]);

    return (
        <UsuarioContext.Provider value={contexto}>
            {children}
        </UsuarioContext.Provider>
    );
}
