export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validateServiceName(name: string): boolean {
  return name.trim().length > 0 && name.length <= 100;
}

export function validateDuration(duration: number): boolean {
  return duration > 0 && duration <= 480; // Max 8 hours
}

export function validatePrice(price: number): boolean {
  return price > 0 && price <= 10000;
}

export function validateTime(time: string): boolean {
  const re = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return re.test(time);
}
