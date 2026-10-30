# MundoGlobal Travel — prototipo End-to-End

Aplicación React/Vite que demuestra la digitalización integral del proceso comercial de una agencia de viajes: búsqueda, cotización, personalización, reserva simulada, autogestión y asistencia.

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

1. En **Inicio**, completar origen, destino, fechas y pasajeros, y presionar **Cotizar ahora**.
2. En **Paquetes**, aplicar filtros, seleccionar una alternativa o ajustar vuelo, hotel y asistencia. El total se actualiza al instante.
3. En **Checkout**, completar o corregir pasajeros y contacto, elegir un medio de pago de prueba y confirmar. No se solicitan ni persisten datos financieros reales.
4. Se crea un código de reserva, que aparece inmediatamente en **Mis viajes** junto con los servicios y el itinerario.
5. En **Asistencia**, enviar un mensaje simulado o crear una solicitud asociada a la reserva. La solicitud queda visible con su estado.

Las operaciones de reserva y asistencia se guardan en `localStorage` bajo una única clave de infraestructura de demostración, por lo que sobreviven a la navegación y a una recarga local.

## Organización

| Componente / módulo | Responsabilidad | Feature | Servicio / datos |
| --- | --- | --- | --- |
| `Navbar`, `Footer`, `Logo` | Navegación común e identidad de la plataforma | Core | Router hash interno |
| `HomePage`, `TravelSearch` | Búsqueda, validación y accesos a destinos | Home | `useTravel`, `validators` |
| `PackagesPage`, `PackageFilters`, `PackageList`, `PackageSummary` | Filtros, selección y actualización de precio | Paquetes | `package.service`, `useTravel` |
| `CheckoutPage`, `CheckoutStepper`, `ReservationSummary` | Datos de viajeros, pago seguro de prueba y confirmación | Checkout | `createBooking` |
| `MyTripsPage`, `Itinerary`, `TripSide` | Reserva vigente, documentos y timeline | Mis viajes | `bookings` |
| `AssistancePage` | FAQ, chat simulado, creación y listado de reclamos | Asistencia | `createClaim`, `claims` |
| `TravelProvider` | Estado compartido, consistencia, persistencia de demo | Core / estado | adaptador `localStorage` encapsulado |
| `catalog.ts` | Catálogo inicial y reserva de demostración | Mocks | Modelos tipados |
| `models.ts` | Contratos de búsqueda, paquete, reserva y reclamo | Dominio | — |

## Arquitectura del frontend

- `components/`: piezas visuales separadas por layout, UI, búsqueda, paquetes, checkout y viajes.
- `pages/`: composición de cada una de las cinco rutas; coordinan estado y componentes sin contener el shell global.
- `hooks/`: navegación hash encapsulada (`useHashRoute`).
- `services/`: estado compartido y frontera de datos mock, preparada para un repositorio HTTP.
- `utils/`: formateo, navegación, validación y cálculo de precios puros.
- `mocks/` y `models.ts`: catálogo inicial y contratos del dominio.

`App.tsx` queda limitado al shell de navegación: navbar y selección de página activa.

## Sustituciones necesarias al incorporar backend

- Reemplazar `catalog.ts` por repositorios HTTP para disponibilidad, precios, aerolíneas, hoteles y coberturas.
- Sustituir la persistencia de `TravelProvider` por un repositorio autenticado para cotizaciones, reservas, reclamos y documentos.
- Integrar un proveedor de pagos tokenizado: el frontend nunca debe tratar PAN, CVV ni credenciales bancarias.
- Usar identidad, autorización y sesiones reales para que cada usuario vea exclusivamente sus reservas.
- Reemplazar documentos de demostración por enlaces firmados o un endpoint de descarga de vouchers.
- Conectar el chat y las alertas a los canales de soporte/notificación seleccionados por el negocio.

## Validación realizada

- `npm run build` — correcto.
- `npm run lint` — correcto.
- Servidor Vite local — respondió `HTTP 200`.

El entorno de ejecución no proporcionó un navegador disponible para capturas o interacción automatizada, por lo que la revisión visual final debe realizarse abriendo el servidor local o el sitio publicado en un navegador normal.
# tpi-reing
