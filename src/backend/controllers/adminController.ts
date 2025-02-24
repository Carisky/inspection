import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { authService } from '../services/authService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const adminController = {
  async login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Метод не разрешён' });
    }

    const { email, password } = req.body;
    const admin = await authService.authenticate(email, password);
    if (!admin) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Генерация JWT (с данными администратора)
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Записываем токен в httpOnly cookie
    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    }));

    // Отправляем токен в теле ответа (если требуется для client-side)
    return res.status(200).json({ message: 'Логин успешен', token });
  }
};
