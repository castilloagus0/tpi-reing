# MundoGlobal Travel — prototipo End-to-End

Aplicación React/Vite que demuestra la digitalización integral del proceso comercial de una agencia de viajes: búsqueda, cotización, personalización, reserva simulada, autogestión y asistencia.

> Prototipo educativo: todos los datos son mock. El estado del vuelo, el chatbot y el chat con agente son simulados; no hay backend ni IA.

## Ejecutar

```bash
npm install
npm run dev
```

Para verificar el código:

```bash
npm run build
npm run lint
```

## Flujo demostrable

1. En **Inicio**, elegir tipo de viaje, origen, destino, fechas y pasajeros, y presionar **Buscar**.
2. En **Paquetes**, filtrar por precio, aerolínea, estrellas o régimen, ordenar por precio, elegir un paquete y ajustar vuelo, hotel y asistencia. El total se actualiza al instante.
3. En **Reserva** (checkout), completar viajeros y contacto, elegir un medio de pago de prueba y confirmar. No se solicitan ni persisten datos financieros reales.
4. Se crea un código de reserva que aparece en **Mis viajes** con la línea de tiempo del viaje:
   - **Vuelo**: pase de embarque con QR, terminal, puerta, asiento y semáforo de estado en vivo (simulado, cambia cada 12 s).
   - **Traslados**: punto de encuentro, chofer y voucher copiable.
   - **Hotel**: foto, estrellas, código de reserva All Inclusive copiable y **Ver en mapa** (abre la ruta desde tu ubicación si das permiso; si no, solo el hotel).
5. **Asistencia al Viaje** (botón en Mis viajes): chatbot con opciones rápidas — evaluación médica, pérdida de equipaje y problema con el hotel.
6. **Chat con una persona**: botón flotante abajo a la derecha con Lucía, agente de atención al viajero (respuestas mock con tiempos humanos, confirmación de lectura, etc.).
7. En **Ayuda**, buscar en preguntas frecuentes o registrar una solicitud asociada a la reserva y seguir su estado.

Las reservas y solicitudes se guardan en `localStorage` (clave `mundoglobal-travel-state-v2`), así que sobreviven a la navegación y a una recarga.

## Design system

- Tokens (color, tipografía Geist / Geist Mono, espaciado, radios, sombras, z-index y duraciones) en `src/styles/tokens.css`. Ningún otro archivo declara colores literales.
- Componentes base en `src/components/ui`: `Button`, `IconButton`, `Card`, `Badge`, `Avatar`, `Modal` / `Drawer`, `TextField` / `SelectField` / `TextareaField` / `DateField`, `Alert`, `Skeleton`, `EmptyState`, `Stars`.
- Accesibilidad: foco visible, navegación por teclado, roles ARIA, `aria-live` en contenidos dinámicos y animaciones que respetan `prefers-reduced-motion`. Auditado con axe-core (WCAG 2.1 AA).

## Organización

| Componente / módulo | Responsabilidad | Feature | Servicio / datos |
| --- | --- | --- | --- |
| `Navbar`, `Footer`, `Logo`, `PageHeader`, `ErrorBoundary` | Navegación, layout común y estados de error | Core | Router hash (`useHashRoute`) |
| `HomePage`, `TravelSearch` | Búsqueda, validación y accesos a destinos | Home | `useTravel`, `validators` |
| `PackagesPage`, `PackageFilters`, `PackageList`, `PackageCard`, `PackageSummary` | Filtros, orden, selección y personalización del precio | Paquetes | `package.service`, `useTravel` |
| `CheckoutPage`, `CheckoutStepper`, `ReservationSummary` | Viajeros, contacto, pago de prueba y confirmación | Checkout | `createBooking` |
| `MyTripsPage`, `TripHero`, `TripTimeline`, `sections/*` | Línea de tiempo del viaje, documentos y reserva | Mis viajes | `mocks/tripDetails`, `useFlightStatus` |
| `TravelAssistantPage`, `AssistantChat` | Chatbot de asistencia al viaje | Asistencia | `mocks/assistantFlow` |
| `LiveChatWidget`, `useLiveChat` | Chat flotante con agente humano simulado | Chat | `mocks/liveAgent` |
| `AssistancePage` | Canales de ayuda, FAQ, alta y listado de solicitudes | Ayuda | `createClaim`, `claims` |
| `TravelProvider` | Estado compartido y persistencia de demo | Core / estado | `localStorage` encapsulado |
| `catalog.ts`, `media.ts` | Catálogo, reserva inicial e imágenes (Unsplash) | Mocks | Modelos tipados |

### Sumar una sección a la línea de tiempo

1. Definir el tipo del evento (con un `kind` propio) en `src/mocks/tripDetails.ts` y generarlo en `getTripEvents`.
2. Crear su componente en `src/components/trips/sections/` usando `TimelineSection`.
3. Registrarlo en `src/components/trips/sections/registry.ts`. TypeScript avisa si falta registrar un `kind`.
