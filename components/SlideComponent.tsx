'use client';
import { usePathname, useRouter } from "next/navigation";
import SignUp from "./SignUp";
import GradientWaves from "./ui/GradientWaves";
import { useEffect, useState } from "react";

export default function SlideComponent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathName = usePathname();

    const [current, setCurrent] = useState<string | undefined>();

    const map: Record<typeof pathName, { component: React.ReactNode; className: string }> = {
        '/signup': {
            component: <SignUp />,
            className: "fixed w-full sm:w-4/10 h-full top-0 -right-full sm:-right-4/10 bg-black/99",
        },
        '/': {
            component: null,
            className: "",
        }
    }

    useEffect(() => {
        if (pathName !== "/") {
            setCurrent(pathName);
        }
    }, [pathName]);

    const isOpen = pathName !== '/';

    return (
        <div className={`h-full relative w-full bg-transparent transition-transform duration-500 ${isOpen ? "translate-x-[-100%] sm:translate-x-[-40%] " : ""}`}>
            <div className="absolute top-0 left-0 w-full h-full z-0 bg-[#000000]">
                <GradientWaves
                    horizonColor="#e527ff"
                    waveColor="#000000"
                    crestColor="#fff8f8"
                    speed={0.65}
                    amplitude={2.5}
                    waveScale={0.6}
                    waveRatio={0.9}
                    swell={35}
                    turbulence={20}
                    tilt={1.11}
                    zoom={1}
                    height={5.5}
                    fogDepth={15}
                    detail="medium"
                    brightness={1}
                    opacity={1}
                    mouseInteraction
                    parallaxStrength={0.5}
                    grain
                    grainIntensity={0.05}
                />
            </div>
            <div className="absolute top-0 left-0 w-full h-full z-10">

                {!isOpen && children}

                {
                    current && !!map[current] && (
                        <div className={map[current].className}>
                            {/* <SignUp /> */}
                            {map[current].component}
                        </div>
                    )
                }
            </div>
        </div>
    )
}