// import { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';

// interface AccessTokenPayload {
//   sub: string;
//   iat: number;
//   exp: number;
// }

// export function verifyAccessToken(req: NextRequest): AccessTokenPayload {
//   const token = req.cookies.get('access_token')?.value;
//   if (!token) throw new Error('Unauthorized');

//   try {
//     const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as jwt.JwtPayload;
//     // jwt.JwtPayload is an object with iat/exp optionally
//     if (!payload.sub) throw new Error('Unauthorized');
//     return payload as AccessTokenPayload;
//   } catch {
//     throw new Error('Unauthorized');
//   }
// }



// // lib/auth.ts
// import { db } from './db'; // your database client (Prisma, etc.)

// export async function getUserFromSub(sub: string) {
//   const user = await db.user.findUnique({
//     where: { id: Number(sub) }, // sub is usually a string, DB expects number
//     select: {
//       id: true,
//       email: true,
//       role: true,
//       created_at: true,
//     },
//   });

//   if (!user) throw new Error('User not found');
//   return user;
// }


// export function verifyAccessTokenFromCookies(cookies: any) { ... }
// export async function getUserFromSub(sub: string) { ... }
// export async function getVerifiedUserFromCookies(cookies: any) {
//   const payload = verifyAccessTokenFromCookies(cookies);
//   return await getUserFromSub(payload.sub);
// }


// export function verifyAccessTokenFromCookies(cookies: any) {
//   const token = cookies.get('access_token')?.value;
//   if (!token) throw new Error('Unauthorized');

//   const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string };
//   return payload;
// }