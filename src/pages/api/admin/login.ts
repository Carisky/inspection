// src/pages/api/admin/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminController } from '../../../backend/controllers/adminController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return adminController.login(req, res);
}
