// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { getVerifiedUserFromCookies } from '@/lib/auth';

// export default async function ProtectedPage() {
//   let user;
//   try {
//     user = await getVerifiedUserFromCookies(cookies());
//   } catch {
//     // redirect unauthenticated users
//     redirect('/login');
//   }

//   return (
//     <div>
//       <h1>Welcome, {user.email}</h1>
//       <p>Your role: {user.role}</p>
//     </div>
//   );
// }



// ABOUT PAGE:
// import { prisma } from "@/lib/db/prisma"; // your adapter-based instance
// import { House } from "@/generated/prisma/client"; // type from generated client
// import Counter from "@/app/components/Counter";
// import { CreateHouseInput } from "@/contracts/house";
// import { CreateHouseContract } from "@/contracts/house";
// import { createHouse } from "@/services/houses";



// // helper to generate a unique email
// // function generateUniqueEmail() {
// //   return `user${Math.floor(Math.random() * 1000000)}@example.com`;
// // }

// // export function uuidv4(): string {
// //   return crypto.randomUUID();
// // }

// export default async function Page() {
//   // Crate a new house
//   // const input: CreateHouseInput = CreateHouseContract.parse({
//   //   address: "owl street 9",
//   //   price: 500000,
//   //   bedrooms: 3,
//   //   bathrooms: 2
//   // })
//   // createHouse(input)


//   // // Fetch first 5 users
//   // const houses: House[] = await prisma.house.findMany();

//   return (
//     <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
//       <h1>Usdddder</h1>
//       {/* <ul>
//         {houses.map((house) => (
//           <li key={house.id}>
//             ID: {house.id}, Name: {house.address ?? "No name"}, Email: {house.id} is OK
//           </li>
//         ))}
//       </ul> */}

//       <h2>Interactive Counter</h2>
//       <Counter />
//     </main>
//   );
// }

// /home/mygrain/dev/node/nextjs/househub/services/web/src/app/api/protected/route.ts
// API/protected/route.ts 
// app/api/protected/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyAccessToken, getUserFromSub } from '@/lib/auth';

// export async function GET(req: NextRequest) {
//   let payload;
//   try {
//     payload = verifyAccessToken(req); // returns { sub, iat, exp }
//   } catch {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   let user;
//   try {
//     user = await getUserFromSub(payload.sub);
//   } catch {
//     return NextResponse.json({ error: 'User not found' }, { status: 404 });
//   }

//   return NextResponse.json({ user });
// }





    //   - name: Set IMAGE_TAG from commit SHA
    //     id: set-tag
    //     run: |
    //       SHORT_SHA=$(echo $GITHUB_SHA | cut -c1-7)
    //       # SHORT_SHA="cd81dbc"
    //       echo "IMAGE_TAG=$SHORT_SHA" >> $GITHUB_ENV
    //       echo "IMAGE_TAG=$SHORT_SHA" >> $GITHUB_OUTPUT

    //   - name: Build web image
    //     run: docker build -f ./services/web/Dockerfile.web.prod -t ghcr.io/${{ github.repository }}/web:$IMAGE_TAG ./services/web

    //   # - name: Push web image
    //   #   run: docker push ghcr.io/${{ github.repository }}/web:$IMAGE_TAG

    //   # - name: Build nginx image
    //   #   run: docker build -f ./infra/nginx/Dockerfile.nginx.prod -t ghcr.io/${{ github.repository }}/nginx:$IMAGE_TAG .

    //   # - name: Push nginx image
    //   #   run: docker push ghcr.io/${{ github.repository }}/nginx:$IMAGE_TAG