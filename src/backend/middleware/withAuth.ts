import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../utils/auth';

// Расширяем тип NextApiRequest для хранения данных администратора (если нужно)
export interface AuthenticatedNextApiRequest extends NextApiRequest {
  admin?: any;
}

export const withAuth = (
  handler: (req: AuthenticatedNextApiRequest, res: NextApiResponse) => void | Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Отсутствует токен' });
    }

    const adminData = verifyToken(token);
    if (!adminData) {
      return res.status(401).json({ error: 'Неверный токен' });
    }

    // @ts-expect-error Assigning to req.admin is safe because we extend the type via AuthenticatedNextApiRequest
    req.admin = adminData; // Добавляем данные администратора в запрос

    return handler(req as AuthenticatedNextApiRequest, res);
  };
};
