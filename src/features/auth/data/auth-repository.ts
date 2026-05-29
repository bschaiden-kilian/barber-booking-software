import type { Barber } from '../domain/Barber'

export interface AuthRepository {
  getByAuthId(authUserId: string): Promise<Barber | null>
  getCurrent(): Promise<Barber | null>
}
