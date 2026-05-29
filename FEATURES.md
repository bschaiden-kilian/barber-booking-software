# Feature & Method Reference

## Feature: Bookings (`src/features/bookings/`)

Handles customer appointment creation and cancellation.

### Domain types (`domain/types.ts`)
| Type | Fields |
|---|---|
| `Booking` | `id`, `serviceId`, `serviceName`, `date` (ISO), `time` (HH:mm), `durationMinutes`, `priceEuro`, `status`, `createdAt` |
| `BookingStatus` | `'confirmed' \| 'completed' \| 'cancelled'` |
| `BookingDTO` | Same shape as `Booking` — used at the data layer |

### Repository (`data/BookingRepository.ts`) — singleton `bookingRepository`
| Method | Signature | Description |
|---|---|---|
| `getAll` | `() => Booking[]` | Returns all bookings |
| `getById` | `(id: string) => Booking \| undefined` | Finds a booking by ID |
| `getActive` | `() => Booking[]` | Returns only `confirmed` or `completed` bookings |
| `isSlotAvailable` | `(date, time, durationMinutes) => boolean` | Checks for time conflicts on confirmed bookings |
| `create` | `(data: Omit<Booking, 'id' \| 'createdAt'>) => Booking` | Creates and persists a new booking |
| `cancel` | `(id: string) => Booking \| undefined` | Sets booking status to `'cancelled'` |

### Context (`application/BookingContext.tsx`) — consumed via `useBooking()`
| Method | Signature | Description |
|---|---|---|
| `loadBookings` | `() => void` | Fetches all bookings into state |
| `addBooking` | `(data: Omit<Booking, 'id' \| 'createdAt'>) => Booking \| null` | Checks availability, then creates. Returns `null` if slot is taken |
| `cancelBooking` | `(id: string) => void` | Cancels a booking and updates state |

---

## Feature: Services (`src/features/services/`)

Manages the menu of offered haircut/grooming services (admin CRUD).

### Domain types (`domain/types.ts`)
| Type | Fields |
|---|---|
| `Service` | `id`, `name`, `description`, `durationMinutes`, `priceEuro` |
| `ServiceDTO` | Same shape — used at the data layer |

### Repository (`data/ServiceRepository.ts`) — singleton `serviceRepository`
| Method | Signature | Description |
|---|---|---|
| `getAll` | `() => Service[]` | Returns all services |
| `getById` | `(id: string) => Service \| undefined` | Finds a service by ID |
| `create` | `(data: Omit<Service, 'id'>) => Service` | Adds a new service |
| `update` | `(id, data: Partial<Omit<Service, 'id'>>) => Service \| undefined` | Partially updates a service |
| `delete` | `(id: string) => boolean` | Removes a service; returns `false` if not found |

### Context (`application/ServiceContext.tsx`) — consumed via `useServices()`
| Method | Signature | Description |
|---|---|---|
| `loadServices` | `() => void` | Fetches all services into state |
| `addService` | `(data: Omit<Service, 'id'>) => void` | Creates and adds to state |
| `updateService` | `(id, data: Partial<Omit<Service, 'id'>>) => void` | Updates one service in state |
| `deleteService` | `(id: string) => void` | Removes a service from state |

---

## Feature: Availability (`src/features/availability/`)

Controls working hours and generates bookable time slots.

### Domain types (`domain/types.ts`)
| Type | Fields |
|---|---|
| `WorkingHours` | `dayOfWeek` (Mon–Sun), `startTime` (HH:mm), `endTime` (HH:mm), `enabled` |
| `TimeSlot` | `date` (YYYY-MM-DD), `time` (HH:mm), `available`, `reason?` |
| `DayOfWeek` | `'Monday' \| 'Tuesday' \| ... \| 'Sunday'` |
| `AvailabilityDTO` | `{ workingHours: WorkingHours[] }` |

### Repository (`data/AvailabilityRepository.ts`) — singleton `availabilityRepository`
| Method | Signature | Description |
|---|---|---|
| `getWorkingHours` | `() => WorkingHours[]` | Returns deep-cloned working hours |
| `setWorkingHours` | `(hours: WorkingHours[]) => WorkingHours[]` | Replaces and returns working hours |
| `getHoursForDay` | `(dayOfWeek: string) => WorkingHours \| undefined` | Looks up hours for a single day |
| `generateAvailableSlots` | `(date, bookedTimes) => TimeSlot[]` | Produces 30-min slots within working hours, marking conflicts as unavailable |

### Context (`application/AvailabilityContext.tsx`) — consumed via `useAvailability()`
| Method | Signature | Description |
|---|---|---|
| `loadWorkingHours` | `() => void` | Fetches working hours into state |
| `setWorkingHours` | `(hours: WorkingHours[]) => void` | Saves new working hours and updates state |
| `getAvailableSlots` | `(date, bookedTimes) => TimeSlot[]` | Delegates to repository; returns slots for a given date |

---

## Common Utilities

### `src/common/utils/dateHelpers.ts`
| Function | Signature | Description |
|---|---|---|
| `formatDate` | `(isoString: string) => string` | `"2025-06-01"` → `"Sun, Jun 1, 2025"` |
| `formatTime` | `(time: string) => string` | Normalises HH:mm (pass-through) |
| `getNextDays` | `(count: number) => string[]` | Array of `count` ISO date strings starting from today |
| `getDayOfWeekName` | `(isoDate: string) => string` | `"2025-06-01"` → `"Sunday"` |
| `isToday` | `(isoDate: string) => boolean` | True if date matches today |
| `isTomorrow` | `(isoDate: string) => boolean` | True if date matches tomorrow |

### `src/common/utils/validators.ts`
| Function | Signature | Description |
|---|---|---|
| `validateEmail` | `(email: string) => boolean` | Basic regex check |
| `validateServiceName` | `(name: string) => boolean` | Non-empty and ≤ 100 chars |
| `validateDuration` | `(duration: number) => boolean` | 1–480 minutes |
| `validatePrice` | `(price: number) => boolean` | 0.01–10 000 € |
| `validateTime` | `(time: string) => boolean` | HH:mm format |

### `src/lib/use-theme.ts`
| Export | Description |
|---|---|
| `useTheme()` | Returns `{ theme: 'light' \| 'dark', toggle: () => void }`. Persists to `localStorage` under key `atelier-theme` |
