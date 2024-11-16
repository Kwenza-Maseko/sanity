'use client'
import { useUser, useAuth } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenuAlt1 } from "@react-icons/all-files/hi/HiMenuAlt1"
import { IoMdClose } from "@react-icons/all-files/io/IoMdClose"
import { useState } from "react";
import SideBar from "./Sidebar";

const getGreeting = (): string => {
    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    if (currentHour >= 0 && currentHour < 12) {
        return "good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
        return "good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
        return "good evening";
    } else {
        return "good night";
    }
};

const Navbar = () => {
    const { userId } = useAuth();
    const { user, isLoaded } = useUser();
    const greeting = getGreeting();
    const path = usePathname();
    const [dropdown, setDropdown] = useState(false);


    const truncateMessage = (text: string) => {
        return text.length > 10 ? text.slice(0, 12) + '...' : text;
    };
    if (!isLoaded) {
        return <div>Loading..</div>
    }
    return (
        <div className="py-2 px-2 md:px-4 border-b fixed top-0 right-0 lg:left-[260px] left-0
        bg-[#ffffffce] dark:bg-[#000000d2] backdrop-blur-md">
            {!userId ? (<>
                <div>Not User Founded</div>
            </>) : (<>
                <div className="flex justify-between items-center">
                    <div className="">
                        <div className="flex justify-between hidden lg:block">
                            <p className="capitalize text-[14pt] font-bold">{greeting}, {user?.firstName}</p>
                        </div>
                        <div className="flex items-center gap-3 lg:hidden">
                            <div className="text-2xl"
                                onClick={() => (setDropdown((prev) => !prev))}>
                                <HiMenuAlt1 />
                            </div>
                            {
                                dropdown && (
                                    <div className="flex justify-between absolute left-0 right-0 top-0 bottom-0 bg-[#000000d2] z-[60]">
                                        <div>
                                            <SideBar />
                                        </div>
                                        <div className="cursor-pointer m-2 " onClick={() => (setDropdown(false))}>
                                            <div className="rounded-md text-xl dark:bg-[#ffffff] bg-[#000000] text-[#ffffff] dark:text-[#000000] p-1">
                                                <IoMdClose />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <Link href="/" className="flex gap-3 items-center  pacifico-regular">
                                <div className="rounded-md px-2 text-[15pt] bg-slate-100 border dark:bg-[#ffffff] dark:text-[#000000]">
                                    <p>S</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div>
                        {path === "/" ? <p className="font-bold">Home. <span className="text-md">Dashboard</span></p> : <p className="font-bold">Home <span className="text-[12pt] capitalize">{truncateMessage(path)}</span></p>}
                    </div>
                    <div className="flex items-center gap-4">
                        <UserButton />
                        <div className="hidden md:block">
                            <p className="font-bold text-[10pt]">
                                {user?.firstName && user?.lastName ? (
                                    <>
                                        {truncateMessage(`${user.firstName} ${user.lastName}`)}
                                    </>
                                ) : (
                                    "unknown"
                                )}</p>
                            <p className="">
                                {user?.username ? `${truncateMessage(user.username)}` : "guest"}</p>
                        </div>
                    </div>
                </div>
            </>)
            }
        </div >
    )
}

export default Navbar