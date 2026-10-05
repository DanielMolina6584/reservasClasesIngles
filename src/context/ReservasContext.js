import React, { createContext, useCallback, useMemo } from 'react';
import useAlmacenamiento from '../hooks/useAlmacenamiento';

const CLAVE_RESERVAS = '@reservas_ingles';

export const ReservasContext = createContext(null);

export function ReservaProvider({ children }) {
  const {
    valor: reservas,
    actualizar: actualizarReservas,
    listo,
  } = useAlmacenamiento(CLAVE_RESERVAS, []);
  const cargando = !listo;

  // Las reservas guardadas antes de existir claseId solo tienen id = `${clase.id}-${horario}`.
  const obtenerCuposDisponibles = useCallback((clase) => {
    const reservadas = reservas.filter(
      (reserva) => (reserva.claseId ?? reserva.id.split('-')[0]) === clase.id,
    ).length;
    return Math.max(clase.cupos - reservadas, 0);
  }, [reservas]);

  const agregarReserva = useCallback(async (clase, horario) => {
    const id = `${clase.id}-${horario}`;
    if (reservas.some((reserva) => reserva.id === id)) {
      return false;
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
      creadoEn: new Date().toISOString(),
    };

    await actualizarReservas([nuevaReserva, ...reservas]);
    return true;
  }, [actualizarReservas, obtenerCuposDisponibles, reservas]);

  const contexto = useMemo(() => ({
    reservas,
    cargando,
    agregarReserva,
    obtenerCuposDisponibles,
  }), [agregarReserva, cargando, obtenerCuposDisponibles, reservas]);

  return (
    <ReservasContext.Provider value={contexto}>
      {children}
    </ReservasContext.Provider>
  );
}
