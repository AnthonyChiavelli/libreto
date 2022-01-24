export function getLocalStorageValue(key: string, defaultValue: any = undefined): any {
  const value = localStorage.getItem(key)
  return value ?? defaultValue
}

export function setLocalStorageValue(key: string, value: string): void {
  localStorage.setItem(key, value)
}
