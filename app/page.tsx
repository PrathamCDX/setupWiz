import Button from "@/components/ui/Button";
import { LandingButtonSignUp } from "@/components/utils/Landing";
import Image from "next/image";


export default function Home() {
  return (
    <div className="h-full w-full px-5 bg-transparent grid grid-rows-[2fr_5fr] items-center justify-center text-white">
      <div className="h-full w-full flex items-end justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mb-4 h-18 rounded-lg overflow-hidden w-auto"
        />
      </div>
      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="font-semibold text-base tracking-wide">
          AN APP ONLY FOR
        </div>
        <div className="font-bold mt-1 text-3xl tracking-wide">
          EXTROVERTS
        </div>
        <div className="text-white font-light mt-5 mb-2 text-center text-sm tracking-wide">
          <span className="text-red-400">
            Warning:
          </span> May lead to spontaneous dancing and unsolicited high-fives.
        </div>
        <Button
          label="Continue"
          variant="custom"
          onClick={LandingButtonSignUp}
          className=" font-semibold mb-16 text-lg mx-8 w-full rounded-lg border px-6 py-1.5  transition-colors border-white/10 text-gray-800 hover:text-gray-200 bg-white hover:bg-white/10 hover:cursor-pointer"
        // className=" border-white/10 bg-white/5 border px-16 py-3 my-3 rounded-xl backdrop-blur-2xl  "
        />
      </div>
    </div>
  )
}