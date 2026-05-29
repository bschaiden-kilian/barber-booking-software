import type { AuthRepository } from '../data/auth-repository'
import type { Barber } from '../domain/Barber'

export interface IAuthService {
  getCurrentBarber(): Promise<Barber | null>
  signInWithMagicLink(email: string): Promise<void>
  signOut(): Promise<void>
}

export class AuthService implements IAuthService {
  constructor(private repo: AuthRepository) {}

  async getCurrentBarber(): Promise<Barber | null> {
    return this.repo.getCurrent()
  }

  // Phase 3: wire to Supabase auth.signInWithOtp
  async signInWithMagicLink(_email: string): Promise<void> {
    throw new Error('not implemented')
  }

  // Phase 3: wire to Supabase auth.signOut
  async signOut(): Promise<void> {
    throw new Error('not implemented')
  }
}
