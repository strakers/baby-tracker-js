export { v4 as uuidv4 } from 'uuid';
import { supabase } from './auth';

export function publish(data: StorageData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('PUBLISH', data.type, data);
      resolve(data);
    }, 2000);
  });
}

export async function retrieve(table: string, columns: string = '*') {
  return await supabase.from(table).select(columns);
}

export interface StorageData {
  uuid: string;
  type: string;
}
