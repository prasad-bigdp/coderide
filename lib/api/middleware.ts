import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkPermission, Permission } from '@/lib/auth/rbac';

export function withAuth(handler: any, requiredPermission?: Permission) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions);

      if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (requiredPermission) {
        checkPermission(session.user, requiredPermission);
      }

      // Add user to request for handlers
      req.user = session.user;
      
      return handler(req, res);
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}