export class HoldNotFoundError extends Error {
  constructor() {
    super('Der Slot konnte nicht gefunden werden. Bitte wähle einen neuen Termin.')
    this.name = 'HoldNotFoundError'
  }
}

export class HoldExpiredError extends Error {
  constructor() {
    super('Der Slot ist abgelaufen. Bitte wähle einen neuen Termin.')
    this.name = 'HoldExpiredError'
  }
}

// Phase 3: thrown when hold.customerEmail !== customer.email.
// Requires holds to store customerEmail — reserved for Supabase RPC implementation.
export class HoldMismatchError extends Error {
  constructor() {
    super('Die Buchung konnte nicht bestätigt werden. Bitte beginne den Buchungsvorgang erneut.')
    this.name = 'HoldMismatchError'
  }
}
