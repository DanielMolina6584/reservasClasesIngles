import React, { createContext, useCallback, useMemo } from 'react';
import useAlmacenamiento from '../hooks/useAlmacenamiento';

const CLAVE_RESERVAS = '@reservas_ingles';

export const ReservasContext = createContext(null);

export function ReservaProvider({ children }) {
  const {
    valor: reservas,
    actualizar: actualizarReservas,
    listo: cargando,
  } = useAlmacenamiento(CLAVE_RESERVAS, []);

  const agregarReserva = useCallback(async (clase, horario) => {
    const id = `${clase.id}-${horario}`;
    if (reservas.some((reserva) => reserva.id === id)) {
      return false;
    }

    const nuevaReserva = {
      id,
      titulo: clase.titulo,
      nivel: clase.nivel,
      profesor: clase.profesor.nombre,
      precio: clase.precio,
      horario,
      creadoEn: new Date().toISOString(),
    };

    await actualizarReservas([nuevaReserva, ...reservas]);
    return true;
  }, [actualizarReservas, reservas]);

  const contexto = useMemo(() => ({
    reservas,
    cargando,
    agregarReserva,
  }), [agregarReserva, cargando, reservas]);

  return (
    <ReservasContext.Provider value={contexto}>
      {children}
    </ReservasContext.Provider>
  );
}
