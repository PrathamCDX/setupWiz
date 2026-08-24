import Image from "next/image";

export default function SignUpHeader({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex items-center mx-8 mt-6  justify-between">
            <div className="h-16 rounded-3xl overflow-hidden">
                <Image
                    src="/logo.png"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="h-full w-auto "
                />
            </div>
            {children && <div className=" w-full h-full">
                {children}
            </div>}
        </div>
    );
}   