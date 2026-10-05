import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAlmacenamiento(clave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);
  const [listo, setListo] = useState(false);
  const esLista = Array.isArray(valorInicial);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      try {
        const guardado = await AsyncStorage.getItem(clave);
        if (activo && guardado !== null) {
          const valorGuardado = JSON.parse(guardado);
          if (Array.isArray(valorGuardado) !== esLista) {
            throw new Error(`El valor guardado para ${clave} no tiene el tipo esperado.`);
          }
          setValor(valorGuardado);
        }
      } catch (error) {
        console.error(`Error leyendo ${clave}:`, error);
      } finally {
        if (activo) {
          setListo(true);
        }
      }
    };

    cargar();

    return () => {
      activo = false;
    };
  }, [clave, esLista]);

  const actualizar = useCallback(async (nuevoValor) => {
    await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));
    setValor(nuevoValor);
  }, [clave]);

  return { valor, actualizar, listo };
}
