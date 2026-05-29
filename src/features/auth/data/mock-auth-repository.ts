import type { AuthRepository } from './auth-repository'
import { Barber } from '../domain/Barber'
import { MOCK_BARBER_ID } from '@/constants/mock-ids'

const MOCK_BARBER = new Barber(
  MOCK_BARBER_ID,
  '00000000-0000-0000-0000-000000000002',
  'Barber Studio Wien',
  'Europe/Vienna',
  30,
)

export class MockAuthRepository implements AuthRepository {
  async getByAuthId(_authUserId: string): Promise<Barber | null> {
    return MOCK_BARBER
  }

  async getCurrent(): Promise<Barber | null> {
    return MOCK_BARBER
  }
}
