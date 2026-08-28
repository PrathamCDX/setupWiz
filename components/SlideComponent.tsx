'use client';
import { usePathname } from "next/navigation";
import SignUp from "./SignUp";
import GradientWaves from "./ui/GradientWaves";

export default function SlideComponent({ children }: { children: React.ReactNode }) {
    const pathName = usePathname();

    const map: Record<typeof pathName, { component: React.ReactNode; className: string }> = {
        '/signup': {
            component: <SignUp />,
            className: "fixed w-4/10 h-full top-0 -right-4/10 bg-black/99",
        },
    }

    const isOpen = map[pathName] !== undefined;

    return (
        <div className={`h-full relative w-full bg-transparent transition-transform duration-500 ${isOpen ? "translate-x-[-40%] " : ""}`}>
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
                {!map[pathName] && children}
                {
                    !!map[pathName] && (
                        <div className={map[pathName].className}>
                            {/* <SignUp /> */}
                            {map[pathName].component}
                        </div>
                    )
                }
            </div>
        </div>
    )
}