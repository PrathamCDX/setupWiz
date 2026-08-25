'use client';

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();
  return (
    <div>
      Welcome to Demointer

      <button onClick={() => { router.push("/signup") }} className="h-20 border px-10 ">
        Signup
      </button>
    </div>
  )
}