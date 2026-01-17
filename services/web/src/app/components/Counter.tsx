"use client"; // THIS makes it a client component
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount(c => c + 1)}
      style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
    >
      Count: {count}
    </button>
  );
}
