export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ORGANIZER' | 'DRIVER';
  createdAt: string;
}
