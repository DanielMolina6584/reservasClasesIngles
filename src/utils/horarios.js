const MINUTOS_POR_DIA = 24 * 60;
const MINUTOS_POR_SEMANA = 7 * MINUTOS_POR_DIA;
const DIAS = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'];

const FORMATO_HORARIO = /^(\S+)\s+(\d{1,2}):(\d{2})\s*([ap])\.?\s*m\.?$/i;

const quitarTildes = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function convertirHorarioAMinutos(horario) {
  const partes = FORMATO_HORARIO.exec(String(horario ?? '').trim());
  if (!partes) {
    return null;
  }

  const [, dia, hora, minutos, periodo] = partes;
  const indiceDia = DIAS.indexOf(quitarTildes(dia));
  const hora12 = Number(hora);
  const minuto = Number(minutos);
  if (indiceDia === -1 || hora12 < 1 || hora12 > 12 || minuto > 59) {
    return null;
  }

  const hora24 = (hora12 % 12) + (periodo.toLowerCase() === 'p' ? 12 : 0);
  return indiceDia * MINUTOS_POR_DIA + hora24 * 60 + minuto;
}

export function obtenerIntervalo(horario, duracion) {
  const inicio = convertirHorarioAMinutos(horario);
  if (inicio === null || !Number.isFinite(duracion) || duracion <= 0) {
    return null;
  }
  return { inicio, fin: inicio + duracion };
}

export function intervalosSeInterponen(a, b) {
  return [-MINUTOS_POR_SEMANA, 0, MINUTOS_POR_SEMANA].some(
    (desplazamiento) => a.inicio < b.fin + desplazamiento && b.inicio + desplazamiento < a.fin,
  );
}

export function buscarReservaEnConflicto(reservas, intervaloNuevo, obtenerDuracion) {
  const conflicto = reservas.find((reserva) => {
    const intervalo = obtenerIntervalo(reserva.horario, obtenerDuracion(reserva));
    if (!intervalo) {
      console.warn(`No se pudo leer el horario de la reserva ${reserva.id}; se omite al validar cruces.`);
      return false;
    }
    return intervalosSeInterponen(intervaloNuevo, intervalo);
  });
  return conflicto ?? null;
}
