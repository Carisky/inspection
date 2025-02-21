// src/backend/services/authService.ts
import { supabaseAdmin } from '../supabaseClient';

export interface Admin {
  id: number;
  email: string;
  password: string; // хэш пароля
  name: string;
  created_at: string;
}

export const authService = {
  /**
   * Проверяет корректность email и пароля.
   * Возвращает объект администратора при успехе или null при неудаче.
   */
  async authenticate(email: string, password: string): Promise<Admin | null> {
    // Запрашиваем администратора по email и возвращаем один объект
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return null;
    }

    const valid = password === admin.password;

    if (!valid) {
      return null;
    }

    return admin;
  }
};
