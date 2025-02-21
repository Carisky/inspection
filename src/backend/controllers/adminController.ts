// src/backend/controllers/adminController.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { authService } from '../services/authService';

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

    // Генерация токена — здесь можно заменить dummy-token на JWT или другой механизм
    const token = 'dummy-token';

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 день
      path: '/'
    }));

    return res.status(200).json({ message: 'Логин успешен' });
  }
};
