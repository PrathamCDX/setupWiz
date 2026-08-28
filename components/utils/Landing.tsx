'use client';
import { useRouter } from "next/navigation";

export function LandingButtonSignUp() {
    const router = useRouter();

    return (
        <button onClick={() => router.push('/signup')}>
            Login/SignUp
        </button>
    )
}