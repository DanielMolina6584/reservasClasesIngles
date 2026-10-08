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
App.js                     # Raíz: SafeAreaProvider > UsuarioProvider > ReservaProvider > NavigationContainer > RootNavigator
index.js                   # registerRootComponent
src/
  components/              # Componentes reutilizables (BarraNavegacion, CampoFormulario, Card, EstadoVacio, EtiquetaNivel, NivelChip, SesionRequerida, TarjetaReserva)
  context/                 # Contextos globales (ReservasContext, UsuarioContext)
  data/                    # Datos estáticos (CLASES, NIVELES, formatearPrecio)
  hooks/                   # Hooks (useAlmacenamiento, useReserva, useResponsive, useUsuario)
  navigation/              # RootNavigator (stack raíz) y TabsNavigator (pestañas propias con TabRouter)
  screens/                 # Pantallas (ClasesScreen, DetalleClaseScreen, ReservasScreen, PerfilScreen, RegistroScreen, IniciarSesionScreen, EditarContactoScreen)
  theme/                   # colors, spacing, radius, typography
  utils/                   # Funciones puras sin React (horarios: intervalos y cruces entre reservas)
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
- Navegación:
  ```
  RootStack (native-stack)
  ├── Tabs  → Inicio (ClasesScreen) · Reservas (ReservasScreen) · Perfil (PerfilScreen)
  ├── DetalleClase   (encima de las pestañas, sin barra inferior)
  ├── Registro       (desde "Registrarse" en Perfil, Reservas o el aviso de DetalleClase)
  ├── IniciarSesion  (desde "Iniciar sesión" en los mismos lugares; Registro e IniciarSesion se enlazan con `replace`)
  └── EditarContacto (desde "Editar datos de contacto" en Perfil, solo con sesión)
  ```
  - La barra inferior es solo de íconos (`options={{ icono, etiqueta }}`; `etiqueta` es el `accessibilityLabel`).
  - No se usa `@react-navigation/bottom-tabs` (no está instalado): `TabsNavigator` usa `TabRouter` y `useNavigationBuilder`.
  - Pantallas de pestaña con listas: usar `useScrollToTop(ref)` para volver arriba al pulsar la pestaña activa.
  - El margen inferior lo maneja la barra; las pantallas de pestaña no suman `insets.bottom`.
- Sesión de usuario: `useUsuario()` → `usuario` (objeto o `null`), `cargando`, `sesionIniciada`, `guardarSesion(usuario)`,
  `cerrarSesion()`, `registrarUsuario(datos)`, `iniciarSesion(correo, contrasena)`. Se guarda con `useAlmacenamiento` en
  `@usuario_sesion`. "Iniciar sesión" abre `IniciarSesionScreen` (`irAIniciarSesion(navigation)`) y "Registrarse" abre
  `RegistroScreen` (`irARegistro(navigation)`), ambos en `components/SesionRequerida.js`.
- Inicio de sesión: el usuario es el **correo** (se normaliza igual que en el registro; la contraseña no se recorta).
  `iniciarSesion` devuelve `{ iniciada, errores, usuario }`; si el correo no existe o la contraseña no coincide responde
  siempre "Correo o contraseña incorrectos." (`errores.general`). La sesión se guarda **sin** la contraseña. Las cuentas
  sin contraseña (creadas antes de la #012) no pueden entrar. Los formularios usan `components/CampoFormulario.js`.
- Edición de contacto: `actualizarContacto({ correo, telefono })` cambia **solo** esos dos campos de la cuenta con sesión
  (se busca por `usuario.id`, no por correo). Usa las mismas reglas del registro (`validarCorreo`, `validarTelefono`,
  `marcarRepetidos` excluyendo la cuenta propia), responde "No hiciste cambios." si no hay cambios, guarda `actualizadoEn`
  y actualiza `@usuarios_ingles` y `@usuario_sesion` (si falla la sesión, revierte la cuenta). Devuelve
  `{ actualizado, errores, correoCambiado }`. No pide la contraseña (decisión del equipo). Si cambia el correo, el login
  pasa a ser con el correo nuevo.
- Registro: `registrarUsuario(datos)` en `UsuarioContext` normaliza, valida (`validarRegistro`), rechaza correos y teléfonos
  ya registrados, guarda la cuenta con la contraseña en `@usuarios_ingles` y deja la sesión iniciada (`@usuario_sesion`,
  sin la contraseña). La contraseña se guarda **en texto plano** (decisión del equipo: datos de prueba). La foto se guarda como **enlace**
  http(s) opcional: no hay librería para elegir imágenes de la galería ni para copiar archivos (`expo-file-system` solo está
  como dependencia interna de `expo`, no se puede importar).
- **Reservar y consultar Reservas exige sesión.** Sin sesión: `ReservasScreen` muestra `SesionRequerida`, el botón de
  `DetalleClaseScreen` dice "Inicia sesión para reservar" y `agregarReserva` devuelve `{ agregada: false, motivo: 'sinSesion' }`.
  Por eso `UsuarioProvider` debe envolver a `ReservaProvider` en `App.js`.
- **Reservas por usuario.** Cada reserva guarda `usuarioId` (`usuario.id`) y su `id` es `${usuarioId}-${claseId}-${horario}`.
  Todas siguen en `@reservas_ingles`; `useReserva().reservas` devuelve solo las del usuario con sesión, y los duplicados,
  cruces de horario y cancelaciones se validan solo contra ellas. Los cupos cuentan las reservas de todos los usuarios.
  Las reservas sin `usuarioId` (anteriores) no se muestran a nadie ni ocupan cupo.
- Respetar el diseño responsive con `useResponsive` y las áreas seguras con `useSafeAreaInsets`.

## Comandos

```bash
npm start          # expo start
npm run android    # expo start --android
npm run ios        # expo start --ios
```

> `npm run web` requiere `react-dom` y `react-native-web`, que **no** están instalados. Por la regla 1 no se instalan sin autorización.
