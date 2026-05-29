import { mockServices } from './mockData';
import { Service, ServiceDTO } from '../domain/types';

export class ServiceRepository {
  private services: Service[];

  constructor() {
    this.services = [...mockServices];
  }

  // Get all services
  getAll(): Service[] {
    return this.services.map((s) => this.dtoToEntity(s));
  }

  // Get service by ID
  getById(id: string): Service | undefined {
    const service = this.services.find((s) => s.id === id);
    return service ? this.dtoToEntity(service) : undefined;
  }

  // Add new service
  create(data: Omit<Service, 'id'>): Service {
    const id = Date.now().toString();
    const newService: Service = { ...data, id };
    this.services.push(newService);
    return newService;
  }

  // Update service
  update(id: string, data: Partial<Omit<Service, 'id'>>): Service | undefined {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    const updated = { ...this.services[index], ...data };
    this.services[index] = updated;
    return this.dtoToEntity(updated);
  }

  // Delete service
  delete(id: string): boolean {
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) return false;
    this.services.splice(index, 1);
    return true;
  }

  // Convert DTO to entity
  private dtoToEntity(dto: ServiceDTO): Service {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      durationMinutes: dto.durationMinutes,
      priceEuro: dto.priceEuro,
    };
  }
}

// Singleton instance
export const serviceRepository = new ServiceRepository();
