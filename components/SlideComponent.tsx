'use client';
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import SignUp from "./SignUp";

export default function SlideComponent({ children }: { children: React.ReactNode }) {
    // const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    // const pathName = usePathname();
    const [pathName, setPathName] = useState(usePathname());
    const isOpen = usePathname() === '/' ? false : true;

    const map: Record<typeof pathName, React.ReactNode> = {
        '/signup': (<SignUp />),
        '/login': (
            <div className="h-full w-full text-white">
                This is login
            </div>
        )
    }

    return (
        <div className={`h-full relative w-full bg-linear-to-r from-purple-500 to-pink-500 transition-transform duration-500 ${isOpen ? "translate-x-[-40%] " : ""}`}>
            <button onClick={() => { router.push("/signup"); setPathName("/signup"); }} className="h-20 px-10 border">
                Click me
            </button>
            <button onClick={() => { router.push("/login"); setPathName("/login"); }} className="h-20 px-10 border">
                Click me login
            </button>
            <button onClick={() => { router.push("/") }} className="h-20 px-10 border absolute top-0 right-0">
                Back to Home {usePathname()}
            </button>
            <div className="fixed w-4/10 h-full top-0 -right-4/10 bg-black/99">
                {/* <SignUp /> */}
                {map[pathName]}
            </div>
        </div>
    )
}