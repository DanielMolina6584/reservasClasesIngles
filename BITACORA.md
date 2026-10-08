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
    - `src/navigation/ClasesStack.js` → renombrado con `git mv` a `RootNavigator.js`: stack raíz con `Tabs` y `DetalleClase`.
    - `App.js` → usa `RootNavigator`.
    - `src/screens/ClasesScreen.js` → `useScrollToTop`, `keyboardShouldPersistTaps="handled"`, `keyboardDismissMode="on-drag"`,
      `Keyboard.dismiss()` al abrir una clase, `paddingBottom` sin `insets.bottom`.
    - `src/context/ReservasContext.js` → se exporta `obtenerClaseId(reserva)` (misma lógica de antes, reutilizada en Reservas).
    - `AGENTS.md` → estructura y reglas de navegación.
    - **Afecta:** hay una nueva clave en el almacenamiento, `@perfil_ingles`. Las reservas existentes no cambian.
- **Pendientes:** probar en dispositivo. Al abrir DetalleClase desde una reserva se preselecciona el primer horario y no el
  reservado. El cambio de pestaña no tiene animación. `Platform` sin usar en `theme/index.js` (ya existía).

## #005 · 2026-10-06 12:30 (UTC-5) · Análisis: validar cruces de horario entre reservas usando la duración

- **Solicitado por:** Kevin Pineda (git: kpineda@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Pregunta (análisis y propuesta, sin implementar)
- **Pregunta:** Analizar cómo están las clases, los horarios, las reservas, la duración y el almacenamiento, y proponer una
  validación que impida reservar si el intervalo [inicio, inicio + duración) se cruza con otra reserva, mostrando
  "horario ocupado". Explicar el flujo actual, dónde implementarla, cómo calcular los intervalos, cómo detectar el
  solapamiento, qué archivos cambian y qué casos límite probar. Indicar si se puede hacer sin librerías nuevas.
- **Respuesta:**
    - **Flujo actual:** `DetalleClaseScreen.reservarClase()` → `useReserva().agregarReserva(clase, horario)` en
      `ReservasContext` → arma `id = ${clase.id}-${horario}`, rechaza solo el mismo id exacto (devuelve `false`), revisa
      cupos (lanza error) → `useAlmacenamiento.actualizar()` guarda el arreglo en AsyncStorage (`@reservas_ingles`).
    - **Datos:** `horario` es texto semanal sin fecha (`'Mié 7:00 a.m.'`); `duracion` está en minutos en `CLASES`
      (45, 50 o 60), pero **no se guarda en la reserva**. Hoy no se valida ningún cruce entre clases distintas.
    - **Dónde:** en `agregarReserva` (`src/context/ReservasContext.js`), antes de guardar: es el único punto por donde pasa
      toda reserva. Las funciones de cálculo, puras, en un archivo nuevo `src/utils/horarios.js`.
    - **Intervalo:** minutos desde el lunes 00:00: `inicio = díaSemana * 1440 + hora24 * 60 + minutos`
      (12 a.m. → 0, 12 p.m. → 12, p.m. suma 12); `fin = inicio + duracion`. Intervalo semiabierto [inicio, fin).
    - **Solapamiento:** `inicioA < finB && inicioB < finA`. Con `<` estricto las clases consecutivas (10:00–11:00 y
      11:00–12:00) no chocan. Para la vuelta de la semana (domingo noche → lunes) se compara también con ±10080 min.
    - **Duración de reservas antiguas:** se toma `reserva.duracion` y, si no existe, se busca en `CLASES` por `claseId`
      (o `id.split('-')[0]`, como ya hace `obtenerCuposDisponibles`).
    - **Hallazgo:** con los datos actuales de `clases.js` **no hay ningún cruce real** entre los 19 horarios (verificado con
      un script); solo hay 3 pares consecutivos (Mié 6:00–7:00 / 7:00, Jue 18:00–19:00 / 19:00, Sáb 10:00–11:00 / 11:00).
      Para probar cruces parciales o contenidos hay que usar datos de prueba.
    - **Conclusión:** se puede implementar **solo con lo existente** (JavaScript, React Context, AsyncStorage, `Alert`);
      no se necesita ninguna librería nueva.
- **Cambios realizados:**
    - Nuevo `src/utils/horarios.js` → `convertirHorarioAMinutos`, `obtenerIntervalo`, `intervalosSeInterponen`,
      `buscarReservaEnConflicto`. **Por qué:** lógica pura y reutilizable, fácil de probar. **Afecta:** nada por sí solo.
    - `src/context/ReservasContext.js` → `agregarReserva` llama a `buscarReservaEnConflicto` y guarda `duracion` en la
      reserva nueva; devuelve un resultado (`{ agregada, motivo, conflicto }`) en lugar de `true/false`.
      **Afecta:** las reservas nuevas tienen un campo más (`duracion`), las antiguas siguen funcionando.
    - `src/screens/DetalleClaseScreen.js` → muestra "Horario ocupado" con la clase con la que se cruza. Es el único
      consumidor de `agregarReserva`.
    - `AGENTS.md` → agregar `src/utils/` a la estructura.
- **Casos a probar:** consecutivas (10:00–11:00 y 11:00) se aceptan; parcial (10:00–11:00 y 10:30) se rechaza; inicio
  anterior que termina dentro (9:30 de 60 min) se rechaza; contenida (10:15 de 30 min dentro de 10:00–11:00) se rechaza;
  la que contiene a otra (9:00 de 180 min) se rechaza; misma hora otro día se acepta; duraciones distintas (45 a las
  10:00 y 60 a las 10:45) se aceptan, (50 a las 10:00 y 10:45) se rechaza; mismo id se sigue rechazando; 12:00 p.m. y
  12:00 a.m.; reservas antiguas sin `duracion`; horario con formato no reconocido; cruce domingo → lunes.
- **Pendientes:**
    - Definir si un horario guardado que no se pueda leer se ignora (propuesto: ignorarlo y registrar `console.warn`) o
      bloquea la reserva.

## #006 · 2026-10-07 20:15 (UTC-5) · Revisión general del estado del proyecto

- **Solicitado por:** Kevin Pineda (git: kpineda@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Revisión
- **Pregunta:** Investigar el proyecto (estructura, estado actual y funcionamiento).
- **Respuesta:** Se revisaron `AGENTS.md`, la bitácora, `package.json`, `app.json`, `App.js`, todo `src/` y git.
  La validación de cruces propuesta en la #005 **ya está implementada** (commit `d0787a9`: `src/utils/horarios.js`,
  `agregarReserva` devuelve `{ agregada, motivo, conflicto }`, alerta "Horario ocupado"), pero no tiene entrada de implementación.
  Observaciones (no corregidas):
    1. `clases.js` ahora sí tiene cruces reales (Lun 7:00 a.m. en clases 1 y 4; Jue 6:00 p.m. en 2 y 7; Sáb 10:00/10:15;
       Lun 8:00/8:30 p.m.), distinto a lo que dice la #005; puede que sean datos de prueba.
    2. Reservas y Perfil siguen usando `ClasesScreen`; no existe la clave `@perfil_ingles` que menciona la #004, y
       `obtenerClaseId` ya no se exporta.
    3. Los cupos siguen contándose por clase (no por horario) y solo con las reservas locales del usuario.
    4. `EtiquetaNivel` usa `colors.background` (gris) sin `borderRadius` ni `borderColor`; el chip activo también es gris.
    5. `package-lock.json` tiene cambios sin commit (173+/198-).
    6. `Platform` sigue sin usarse en `theme/index.js`; el script `web` sigue en `package.json` sin sus dependencias.
- **Cambios realizados:** Ninguno en el código (solo esta entrada).
- **Pendientes:** confirmar si los cruces en `clases.js` son intencionales; registrar la implementación de la #005;
  revisar el cambio pendiente en `package-lock.json`.

## #007 · 2026-10-07 20:17 (UTC-5) · Análisis: nueva pantalla de Reservas (solo visualización)

- **Solicitado por:** Kevin Pineda (git: kpineda@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Pregunta (análisis y propuesta, sin implementar)
- **Pregunta:** Cómo implementar una pantalla de Reservas que por ahora solo muestre las reservas existentes (sin abrir el
  detalle ni agregar funciones). Analizar cómo se manejan y obtienen las reservas, qué se puede reutilizar, dónde integrarla
  en la navegación e indicar si se puede hacer solo con las librerías y estructuras existentes.
- **Respuesta:**
    - **Manejo actual:** las reservas viven en `ReservasContext` y se guardan en AsyncStorage (`@reservas_ingles`) con
      `useAlmacenamiento`. Se leen con `useReserva()`, que expone `reservas` (arreglo, la más reciente primero) y `cargando`.
      Cada reserva guarda `id`, `claseId`, `titulo`, `nivel`, `profesor` (texto), `precio`, `horario`, `creadoEn` y, desde el
      commit `d0787a9`, `duracion` (las anteriores no la tienen; se obtiene de `CLASES` como hace `obtenerDuracionReserva`).
    - **Reutilizable:** `useReserva`, `EstadoVacio` (lista vacía), `EtiquetaNivel`, `formatearPrecio`, `useResponsive`
      (columnas y padding), `useScrollToTop` y `useSafeAreaInsets` (mismo patrón que `ClasesScreen`), el tema e `Ionicons`.
      `convertirHorarioAMinutos` (`utils/horarios.js`) sirve para ordenar por día y hora de la semana.
      `Card` **no** se reutiliza tal cual: espera un objeto `clase` (`imagen`, `profesor.nombre`) y es presionable; la reserva
      no tiene imagen y `profesor` es texto.
    - **Navegación:** la pestaña `Reservas` ya existe en `RootNavigator.js` con `ClasesScreen` temporal; basta con cambiar su
      `component` por `ReservasScreen`. No se navega a `DetalleClase`.
    - **Conclusión:** se puede implementar **solo con lo existente** (React Native, React Navigation, Context, AsyncStorage,
      `@expo/vector-icons`); no se necesita ninguna librería nueva.
- **Cambios realizados:**
    - Nuevo `src/screens/ReservasScreen.js` → título, `FlatList` de reservas ordenadas por horario semanal (`useMemo`), estado
      de carga mientras `cargando`, `EstadoVacio` si no hay reservas, columnas según `useResponsive`, `useScrollToTop`,
      `paddingTop` con `insets.top` y sin `insets.bottom`. **Por qué:** pantalla propia de la pestaña. **Afecta:** solo lectura;
      no cambia datos guardados.
    - Nuevo `src/components/TarjetaReserva.js` → tarjeta no presionable con `EtiquetaNivel`, título, profesor, horario,
      duración y precio. **Por qué:** `Card` no encaja con la forma de la reserva. **Afecta:** nada fuera de la pantalla.
    - `src/context/ReservasContext.js` → exportar `obtenerDuracionReserva` (sin cambiar su lógica) para mostrar la duración
      de reservas antiguas. **Afecta:** nada en el comportamiento.
    - `src/navigation/RootNavigator.js` → pestaña `Reservas` usa `ReservasScreen`. **Afecta:** la pestaña deja de mostrar el catálogo.
    - `AGENTS.md` → actualizar estructura y nota de navegación (Reservas ya no es temporal).

## #008 · 2026-10-07 20:38 (UTC-5) · Análisis: cancelar reservas desde la pantalla de Reservas

- **Solicitado por:** Kevin Pineda (git: kpineda@virtualllantas.com · sesión: hcastaneda@virtualllantas.com)
- **Respondido por:** Claude Code (Claude Opus 5.5)
- **Tipo:** Pregunta (análisis y propuesta, sin implementar)
- **Pregunta:** Cómo permitir únicamente cancelar reservas existentes desde la pantalla de Reservas (sin editar ni crear).
  Analizar cómo se manejan las reservas, cómo se identifica una reserva, qué función usar o modificar, cómo se actualiza la
  lista después de cancelar y dónde integrar la acción en la pantalla. Indicar si se puede hacer solo con lo existente.
- **Respuesta:**
    - **Estado actual:** la pantalla `ReservasScreen` (con `TarjetaReserva`) ya existe y solo muestra las reservas; se
      implementó después de la #007 sin entrada propia en la bitácora, por indicación del solicitante. Las reservas viven en
      `ReservasContext` (AsyncStorage, `@reservas_ingles`, vía `useAlmacenamiento`) y se leen con `useReserva()`.
      **No existe ninguna función para eliminar reservas**: el contexto solo expone `agregarReserva` y `obtenerCuposDisponibles`.
    - **Identificación:** por `reserva.id` (`${claseId}-${horario}`). Es único porque `agregarReserva` rechaza duplicados, y
      no depende de que el horario se pueda leer.
    - **Función:** agregar `cancelarReserva(id)` en `ReservasContext`, junto a `agregarReserva`: filtra el arreglo sin esa
      reserva y lo guarda con `actualizarReservas` (que escribe en AsyncStorage y luego actualiza el estado). Devuelve `true`
      si la canceló y `false` si ya no existía. Se expone en el valor del contexto. `useAlmacenamiento` no necesita cambios.
    - **Actualización de la lista:** automática. Al cambiar `reservas` en el contexto se recalcula el orden (`useMemo`) en
      `ReservasScreen`, desaparece la tarjeta, aparece `EstadoVacio` si era la última, y `obtenerCuposDisponibles` devuelve
      el cupo en `DetalleClaseScreen`. No hace falta recargar manualmente.
    - **Riesgo detectado:** `agregarReserva`/`cancelarReserva` usan el arreglo `reservas` de su cierre (closure). Si se cancelan
      dos reservas muy rápido, la segunda puede partir del arreglo viejo y volver a guardar la primera. Se propone permitir
      una sola cancelación a la vez en la pantalla (ref + estado, igual que `reservandoRef` en `DetalleClaseScreen`).
    - **Integración en la pantalla:** botón "Cancelar reserva" dentro de cada `TarjetaReserva` (la tarjeta sigue sin abrir el
      detalle). Al pulsarlo, confirmación con `Alert.alert` ("No, mantener" / "Sí, cancelar" con `style: 'destructive'`);
      mientras se guarda, el botón queda deshabilitado y muestra "Cancelando..."; si falla, alerta "Error al cancelar".
      No se muestra alerta de éxito porque la tarjeta desaparece.
    - **Conclusión:** se puede implementar **solo con lo existente** (React Native `Alert`/`Pressable`, Context,
      AsyncStorage, `@expo/vector-icons`); no se necesita ninguna librería nueva.
- **Cambios realizados:**
    - `src/context/ReservasContext.js` → nueva `cancelarReserva(id)` expuesta en el contexto. **Por qué:** es el único punto
      que escribe las reservas. **Afecta:** elimina la reserva de AsyncStorage; libera el cupo de esa clase.
    - `src/components/TarjetaReserva.js` → props `onCancelar` y `cancelando`; botón con ícono `close-circle-outline`,
      `accessibilityRole="button"` y `accessibilityLabel` con el título y el horario. **Afecta:** solo la tarjeta.
    - `src/screens/ReservasScreen.js` → confirmación, bloqueo de una cancelación a la vez, manejo de error y paso de
      `cancelando` a la tarjeta correspondiente. **Afecta:** solo la pestaña Reservas.
- **Casos a probar:** cancelar y ver que desaparece; cancelar la última y ver el estado vacío; elegir "No, mantener";
  doble toque y dos cancelaciones seguidas; volver a reservar el mismo horario después de cancelarlo; cupos en el detalle
  después de cancelar; reiniciar la app y comprobar que la reserva cancelada no vuelve; reserva antigua sin `duracion`.