# Bitácora de preguntas

Registro cronológico de las preguntas y solicitudes hechas a los agentes de IA en este proyecto.
Reglas de uso: ver `AGENTS.md` (regla 3). Las entradas nuevas van **al final**; no se editan las anteriores.

**Plantilla**

```
## #NNN · AAAA-MM-DD HH:MM (zona) · Título corto
- **Solicitado por:** nombre (usuario/correo)
- **Respondido por:** agente / modelo
- **Tipo:** Pregunta | Solicitud de cambio | Revisión | Bug
- **Pregunta:** texto (resumido si es largo)
- **Respuesta:** resumen
- **Cambios realizados:** archivo → qué / por qué / en qué afecta (o "Ninguno")
- **Pendientes:** lo que queda abierto
```

---

## #001 · 2026-10-01 10:50 (UTC-5) · Reglas del equipo, bitácora y revisión inicial
- **Solicitado por:** dmolina (git: dmolina@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Solicitud de cambio + Revisión
- **Pregunta:** Analizar la estructura del proyecto (Expo / React Native). Establecer reglas en `AGENTS.md`/`CLAUDE.md`
  para que el equipo las siga: no instalar librerías adicionales; llevar una bitácora de preguntas con respuestas,
  autor, fecha y hora; no actualizar Expo salvo petición; explicar cada cambio (qué, por qué y en qué afecta).
  Empezar revisando los archivos de agentes, crear la bitácora y reportar errores encontrados en la primera revisión.
- **Respuesta:** Se revisó todo `src/`, `App.js`, `app.json`, `package.json`, los logs de `.expo` y el estado de git.
  Se documentaron las reglas y se creó esta bitácora. Errores encontrados (no corregidos, pendientes de aprobación):
  1. **Crítico – botón "Reservar clase" bloqueado:** `ReservasContext` expone `listo` con el nombre `cargando`
     (`listo: cargando`). Cuando AsyncStorage termina de cargar, `cargando` pasa a `true`, así que en
     `DetalleClaseScreen` el botón queda deshabilitado y muestra "Cargando..." de forma permanente.
  2. **Cupos no persisten:** `cuposDisponibles` es estado local inicializado con `clase.cupos`; al salir y volver a
     entrar al detalle los cupos se restauran y no descuentan las reservas guardadas. Además los cupos son por clase,
     no por horario.
  3. **`StatusBar style='white'` inválido** en `App.js`: los valores válidos son `auto`, `inverted`, `light`, `dark`.
  4. **Descripción de la clase no se muestra:** existe el estilo `descripcion` y el dato en `clases.js`,
     pero `DetalleClaseScreen` nunca renderiza `clase.descripcion` (tampoco se usa `rating`).
  5. **Doble padding horizontal** en `ClasesScreen`: el contenedor aplica `spacing.lg` y la lista aplica también
     `paddingHorizontal` de `useResponsive` (16+16 en móvil, 16+32 en tablet).
  6. **`EtiquetaNivel`:** el texto lleva espacios extra (`> { nivel } <`), `alignSelf: 'auto'` hace que se estire a
     todo el ancho en la tarjeta, e importa `radius` y `typhography` sin usarlos.
  7. **Tema duplicado:** `colors.border` y `colors.borde` tienen el mismo valor y se usan indistintamente.
  8. **Nombres con errores de ortografía:** carpeta `src/componets` y export `typhography`. En `ClasesStack` se importa
     `ClasesScreen` como `StartScreen`.
  9. **Búsqueda sensible a tildes:** buscar "ingles" no encuentra "Inglés". El nivel "Basico" va sin tilde.
  10. **`useAlmacenamiento` no es genérico:** lanza error si el valor guardado no es un arreglo.
- **Cambios realizados:**
  - `AGENTS.md` → se reescribió con las reglas obligatorias, la estructura y las convenciones. **Por qué:** es el archivo
    que leen los agentes (Codex, etc.) y que `CLAUDE.md` importa, así hay una sola fuente de reglas. **Afecta:** solo
    documentación; no cambia el comportamiento de la app. Se conservó la advertencia original de Expo v57.
  - `CLAUDE.md` → sin cambios (ya contiene `@AGENTS.md`, que importa las reglas).
  - `BITACORA.md` → nuevo. **Por qué:** registro de preguntas pedido por el responsable. **Afecta:** solo documentación.
- **Pendientes:** decidir qué errores de la lista corregir y en qué orden (se sugiere empezar por el #1 y el #3).

## #002 · 2026-10-05 15:53 (UTC-5) · Explicación detallada de las correcciones 3 a 10
- **Solicitado por:** dmolina (git: dmolina@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Pregunta
- **Pregunta:** Explicar exactamente los cambios de los puntos 3 a 10: qué error había, qué se cambió y por qué debe ser así.
- **Respuesta:** Se explicó cada punto con su diff (ver la respuesta en la sesión). Resumen: 3 `StatusBar` con valor válido `dark`;
  4 se muestran `descripcion` y `rating`; 5 un solo padding horizontal desde `useResponsive`; 6 `EtiquetaNivel` sin
  espacios, con `alignSelf: 'flex-start'` y sin imports sin usar; 7 solo `colors.borde`; 8 `components`, `typography`,
  `ClasesScreen`; 9 búsqueda sin tildes y nivel `Básico`; 10 `useAlmacenamiento` valida el tipo según `valorInicial`.
- **Nota:** la entrada #002 (corrección de errores, 2026-10-01 11:22) y los puntos 11 a 13 de la #001 ya no están en el
  archivo; se retiraron manualmente. Esta entrada sigue la numeración.
- **Cambios realizados:** Ninguno en el código (solo esta entrada).
- **Pendientes:** Ninguno nuevo.

## #003 · 2026-10-05 16:14 (UTC-5) · Propuesta de navegación inferior (Inicio, Reservas, Perfil) con íconos
- **Solicitado por:** dmolina (git: dmolina@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Pregunta
- **Pregunta:** Cómo organizar la navegación con una barra inferior de solo íconos con tres opciones (Inicio, Reservas,
  Perfil), por qué esa estructura es adecuada y qué tener en cuenta para que se vea bien y funcione.
- **Respuesta:** `@react-navigation/bottom-tabs` **no está instalado** y la regla 1 impide instalarlo sin autorización.
  Se propone un navegador de pestañas propio con `createNavigatorFactory` + `useNavigationBuilder` + `TabRouter`, que ya
  exporta `@react-navigation/native` 7.3.18 (verificado en `node_modules`). Estructura: un stack raíz con `Tabs` y
  `DetalleClase`, para que el detalle (que tiene su propia barra fija de "Reservar") tape la barra de pestañas. Las
  pestañas son Inicio (ClasesScreen), Reservas (nueva, usa `useReserva`) y Perfil (nueva, puede guardar datos con
  `useAlmacenamiento`). Como la barra es solo de íconos: `accessibilityLabel`, `accessibilityRole="tab"`, ícono relleno
  si está activo y de contorno si no, áreas táctiles de 48 dp e inset inferior del área segura.
- **Cambios realizados:** Ninguno (solo propuesta).
- **Pendientes:** Aprobar la propuesta para implementarla, o autorizar `@react-navigation/bottom-tabs` si se prefiere esa librería.

## #004 · 2026-10-06 07:47 (UTC-5) · Implementación de la navegación inferior con íconos
- **Solicitado por:** dmolina (git: dmolina@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Solicitud de cambio
- **Pregunta:** Aplicar la propuesta #004 sin librerías nuevas: barra inferior solo de íconos (Inicio, Reservas, Perfil) con
  accesibilidad; DetalleClase en el RootStack; pestaña activa diferenciada; áreas táctiles; safe area; altura estable; estado
  conservado; volver arriba al repetir pestaña; teclado en ClasesScreen; Reservas con `useReserva()`; Perfil con el
  almacenamiento existente; probar los recorridos Inicio→Detalle→volver, Inicio→Reservas, Inicio→Perfil, Reservas→Detalle y Perfil→Inicio.
- **Respuesta:** Implementado. Verificado con `expo export` (Android e iOS), un análisis estático con `@babel/core` (sin
  variables sin declarar ni imports inexistentes) y un banco de pruebas en Node, fuera del proyecto, que monta la app real
  con los routers reales de React Navigation y su `useScrollToTop` (solo se simula la capa nativa): 47/47 comprobaciones
  en teléfono y tablet. El banco se validó metiendo errores a propósito (los detecta). **No se probó en dispositivo/emulador.**
- **Cambios realizados:**
  - Nuevo `src/navigation/TabsNavigator.js` → navegador de pestañas con `TabRouter`; monta cada pestaña al visitarla y luego
    solo la oculta (`display: 'none'`) para conservar su estado.
  - Nuevo `src/components/BarraNavegacion.js` → íconos sin texto, `accessibilityRole/Label/State`, ícono relleno + color +
    fondo en la activa, áreas de 56 dp, altura `56 + insets.bottom`, emite `tabPress`, se oculta con el teclado en Android.
  - Nuevas `src/screens/ReservasScreen.js` (lista `useReserva().reservas`, abre DetalleClase) y `src/screens/PerfilScreen.js`
    (nombre, correo y nivel guardados con `useAlmacenamiento('@perfil_ingles')`).
  - `src/navigation/ClasesStack.js` → renombrado con `git mv` a `RootNavigator.js`: stack raíz con `Tabs` y `DetalleClase`.
  - `App.js` → usa `RootNavigator`.
  - `src/screens/ClasesScreen.js` → `useScrollToTop`, `keyboardShouldPersistTaps="handled"`, `keyboardDismissMode="on-drag"`,
    `Keyboard.dismiss()` al abrir una clase, `paddingBottom` sin `insets.bottom`.
  - `src/context/ReservasContext.js` → se exporta `obtenerClaseId(reserva)` (misma lógica de antes, reutilizada en Reservas).
  - `AGENTS.md` → estructura y reglas de navegación.
  - **Afecta:** hay una nueva clave en el almacenamiento, `@perfil_ingles`. Las reservas existentes no cambian.
- **Pendientes:** probar en dispositivo. Al abrir DetalleClase desde una reserva se preselecciona el primer horario y no el
  reservado. El cambio de pestaña no tiene animación. `Platform` sin usar en `theme/index.js` (ya existía).
