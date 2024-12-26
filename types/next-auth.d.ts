import 'next-auth';
import { Batch } from './batch';

declare module 'next-auth' {
  interface User {
    id: string;
    role: string;
    batch?: Batch;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      batch?: Batch;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    batch?: Batch;
  }
}