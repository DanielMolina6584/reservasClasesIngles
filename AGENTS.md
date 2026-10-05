# Reglas del proyecto: Reservas de Clases de Inglés

Este archivo es la **fuente única de reglas** para cualquier agente de IA (Claude, Codex, Copilot, etc.) y para todo el equipo.
`CLAUDE.md` lo importa con `@AGENTS.md`; no dupliques reglas allí: edítalas aquí.

## Expo HAS CHANGED

Lee la documentación de la versión exacta en https://docs.expo.dev/versions/v57.0.0/ antes de escribir código.
La API de Expo/React Native cambia entre versiones: no asumas comportamientos de versiones anteriores.

## Reglas obligatorias

1. **No instalar librerías adicionales.**
   - Prohibido `npm install <paquete>`, `npx expo install <paquete>`, `yarn add`, etc.
   - Las mejoras (módulos, screens, componentes) se hacen con las dependencias que ya están en `package.json`:
     `expo`, `react`, `react-native`, `@react-navigation/native`, `@react-navigation/native-stack`,
     `react-native-screens`, `react-native-safe-area-context`, `@react-native-async-storage/async-storage`,
     `@expo/vector-icons`, `expo-font`, `expo-status-bar`.
   - Si algo parece imposible sin una librería nueva, **detenerse y preguntar** antes de proponerla.
   - `npm install` sin argumentos (restaurar `node_modules` desde `package-lock.json`) sí está permitido.

2. **No actualizar Expo** (ni `react`, `react-native` u otros paquetes del SDK) a menos que el responsable del proyecto lo pida explícitamente.
   - Prohibido `npx expo install --fix`, `npx expo upgrade`, `npm update` o cambiar versiones en `package.json`.
   - Versión actual: **Expo SDK 57** (`expo` fijado en `57.0.26`, sin `^`), React Native 0.86, React 19.2.

3. **Bitácora de preguntas** en [`BITACORA.md`](./BITACORA.md).
   - Cada pregunta o solicitud que se le haga al agente se registra con: número, fecha y hora (con zona horaria),
     quién la realizó, quién respondió (agente/modelo), la pregunta, la respuesta resumida y los archivos afectados.
   - Las entradas se agregan al final, en orden cronológico. No se borran ni se reescriben entradas anteriores;
     si algo cambió, se agrega una nueva entrada que lo aclare.

4. **Explicar cada cambio.** Al terminar una tarea, el agente debe explicar (en la respuesta y en la bitácora):
   - **Qué** cambió (archivos y funciones).
   - **Por qué** se hizo.
   - **En qué afecta** (pantallas, comportamiento, datos guardados, riesgos o efectos secundarios).

5. **Reportar errores, no ocultarlos.** Si durante una revisión se detecta un error ajeno a la tarea,
   se reporta al responsable antes de corregirlo (salvo que se haya pedido corregirlo).

## Estructura del proyecto

```
App.js                     # Raíz: SafeAreaProvider > ReservaProvider > NavigationContainer
index.js                   # registerRootComponent
src/
  components/              # Componentes reutilizables (Card, EstadoVacio, EtiquetaNivel, NivelChip)
  context/                 # Contextos globales (ReservasContext)
  data/                    # Datos estáticos (CLASES, NIVELES, formatearPrecio)
  hooks/                   # Hooks (useAlmacenamiento, useReserva, useResponsive)
  navigation/              # Navegadores (ClasesStack)
  screens/                 # Pantallas (ClasesScreen, DetalleClaseScreen)
  theme/                   # colors, spacing, radius, typography
```

> Nota: desde la entrada #002 de la bitácora la carpeta es `src/components` (antes `componets`) y el tema exporta
> `typography` (antes `typhography`). Para bordes se usa solo `colors.borde`.

## Convenciones de código

- JavaScript (no TypeScript), componentes funcionales y hooks.
- Nombres de componentes, variables y textos de UI **en español**, siguiendo el estilo existente
  (`ClasesScreen`, `agregarReserva`, `cuposDisponibles`).
- Estilos con `StyleSheet.create` al final del archivo, usando los tokens de `src/theme`
  (`colors`, `spacing`, `radius`, `typography`) en lugar de valores sueltos.
- Íconos solo con `Ionicons` de `@expo/vector-icons`.
- Estado global con Context + hooks (`ReservasContext` / `useReserva`). Persistencia con `useAlmacenamiento` (AsyncStorage).
- Las pantallas nuevas se registran en un navegador de `src/navigation/`.
- Respetar el diseño responsive con `useResponsive` y las áreas seguras con `useSafeAreaInsets`.

## Comandos

```bash
npm start          # expo start
npm run android    # expo start --android
npm run ios        # expo start --ios
```

> `npm run web` requiere `react-dom` y `react-native-web`, que **no** están instalados. Por la regla 1 no se instalan sin autorización.
