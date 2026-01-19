import { prisma } from "@/lib/prisma"; // your adapter-based instance
import { House } from "@/generated/prisma/client"; // type from generated client
import Counter from "@/app/components/Counter";
import { CreateHouseInput } from "@/contracts/house";
import { CreateHouseContract } from "@/contracts/house";
import { createHouse } from "@/services/houses";



// helper to generate a unique email
// function generateUniqueEmail() {
//   return `user${Math.floor(Math.random() * 1000000)}@example.com`;
// }

// export function uuidv4(): string {
//   return crypto.randomUUID();
// }

export default async function Page() {
  // Crate a new house
  // const input: CreateHouseInput = CreateHouseContract.parse({
  //   address: "owl street 9",
  //   price: 500000,
  //   bedrooms: 3,
  //   bathrooms: 2
  // })
  // createHouse(input)


  // // Fetch first 5 users
  // const houses: House[] = await prisma.house.findMany();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Usdder</h1>
      {/* <ul>
        {houses.map((house) => (
          <li key={house.id}>
            ID: {house.id}, Name: {house.address ?? "No name"}, Email: {house.id} is OK
          </li>
        ))}
      </ul> */}

      <h2>Interactive Counter</h2>
      <Counter />
    </main>
  );
}
