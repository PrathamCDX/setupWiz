import SignUp from "@/components/SignUp";

export default function Home() {
    return (
        <div className="h-full w-full border border-red-500 grid sm:grid-cols-[3fr_2fr] ">
            <div className="h-full hidden sm:block border border-green-500"></div>
            <div className="h-full border border-blue-500">
                <SignUp />
            </div>
        </div>
    )
}
