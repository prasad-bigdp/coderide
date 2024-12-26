import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkPermission, Permission } from '@/lib/auth/permissions';

export async function withAuth(
  handler: Function, 
  requiredPermission?: Permission | Permission[]
) {
  return async (req: Request) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401 }
        );
      }

      if (requiredPermission) {
        const permissions = Array.isArray(requiredPermission) 
          ? requiredPermission 
          : [requiredPermission];

        try {
          permissions.forEach(permission => 
            checkPermission(session.user, permission)
          );
        } catch (error) {
          return new NextResponse(
            JSON.stringify({ error: 'Forbidden' }),
            { status: 403 }
          );
        }
      }

      return handler(req, session);
    } catch (error) {
      console.error('Auth error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500 }
      );
    }
  };
}