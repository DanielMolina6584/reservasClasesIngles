import React, {createContext, useCallback, useMemo} from 'react';
import {CLASES} from '../data/clases';
import useAlmacenamiento from '../hooks/useAlmacenamiento';
import {buscarReservaEnConflicto, obtenerIntervalo} from '../utils/horarios';

const CLAVE_RESERVAS = '@reservas_ingles';

const obtenerClaseId = (reserva) => reserva.claseId ?? reserva.id.split('-')[0];

export const obtenerDuracionReserva = (reserva) =>
    reserva.duracion ?? CLASES.find((clase) => clase.id === obtenerClaseId(reserva))?.duracion;

export const ReservasContext = createContext(null);

export function ReservaProvider({children}) {
    const {
        valor: reservas,
        actualizar: actualizarReservas,
        listo,
    } = useAlmacenamiento(CLAVE_RESERVAS, []);
    const cargando = !listo;

    const obtenerCuposDisponibles = useCallback((clase) => {
        const reservadas = reservas.filter((reserva) => obtenerClaseId(reserva) === clase.id).length;
        return Math.max(clase.cupos - reservadas, 0);
    }, [reservas]);

    const agregarReserva = useCallback(async (clase, horario) => {
        const id = `${clase.id}-${horario}`;
        const duplicada = reservas.find((reserva) => reserva.id === id);
        if (duplicada) {
            return {agregada: false, motivo: 'duplicada', conflicto: duplicada};
        }

        const intervalo = obtenerIntervalo(horario, clase.duracion);
        if (!intervalo) {
            throw new Error(`Horario no válido para ${clase.titulo}: ${horario}.`);
        }
        const conflicto = buscarReservaEnConflicto(reservas, intervalo, obtenerDuracionReserva);
        if (conflicto) {
            return {agregada: false, motivo: 'ocupado', conflicto};
        }

        if (obtenerCuposDisponibles(clase) <= 0) {
            throw new Error(`No quedan cupos para ${clase.titulo}.`);
        }

        const nuevaReserva = {
            id,
            claseId: clase.id,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre,
            precio: clase.precio,
            horario,
            duracion: clase.duracion,
            creadoEn: new Date().toISOString(),
        };

        await actualizarReservas([nuevaReserva, ...reservas]);
        return {agregada: true, motivo: null, conflicto: null};
    }, [actualizarReservas, obtenerCuposDisponibles, reservas]);

    // Devuelve false si la reserva ya no existía.
    const cancelarReserva = useCallback(async (id) => {
        if (!reservas.some((reserva) => reserva.id === id)) {
            return false;
        }
        await actualizarReservas(reservas.filter((reserva) => reserva.id !== id));
        return true;
    }, [actualizarReservas, reservas]);

    const contexto = useMemo(() => ({
        reservas,
        cargando,
        agregarReserva,
        cancelarReserva,
        obtenerCuposDisponibles,
    }), [agregarReserva, cancelarReserva, cargando, obtenerCuposDisponibles, reservas]);

    return (
        <ReservasContext.Provider value={contexto}>
            {children}
        </ReservasContext.Provider>
    );
}
