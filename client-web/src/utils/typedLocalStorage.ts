
export function getTypedLocalStorage<T>(key: string){
    const item = localStorage.getItem(key);
    
    if(!item) return null
    
    return JSON.parse(item) as T
  }