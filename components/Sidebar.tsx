
'use client'
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { Home, List, Folder, Music } from "lucide-react"
import Search from "./Search";
import { BsPeople } from "@react-icons/all-files/bs/BsPeople";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { IoFolderOutline } from "@react-icons/all-files/io5/IoFolderOutline";
import { RiToolsFill } from "@react-icons/all-files/ri/RiToolsFill";
import { RiFileList3Line } from "@react-icons/all-files/ri/RiFileList3Line";
import { GrSecure } from "@react-icons/all-files/gr/GrSecure";
import { IoVideocamOutline } from "@react-icons/all-files/io5/IoVideocamOutline";

const icons = [
    { component: RiDashboardLine, label: 'dashboard', url: "/" },
    { component: BsPeople, label: 'clients', url: "/allclients" },
    { component: IoFolderOutline, label: 'projects', url: "/projects" },
    { component: RiFileList3Line, label: 'invoices', url: "/invoices" },
    { component: IoVideocamOutline, label: 'meeting', url: "/meeting" },
    { component: RiToolsFill, label: 'tools', url: "/tools" },
];


const SideBar = () => {
    const path = usePathname();

    return (
        <div className="w-[260px] p-2 h-svh overflow-y-hidden border-r-[7px] fixed left-0 bg-[#eeeded] dark:bg-[#000000]">
            <div className="pacifico-regular">
                <Link href="/" className="flex gap-3 items-center">
                    <div className="rounded-md px-2 text-[15pt] bg-slate-100 border dark:bg-[#ffffff] dark:text-[#000000]">
                        <p>S</p>
                    </div>
                    <div>
                        <p className=" text-[15pt]">Sanity</p>
                    </div>
                </Link>
            </div>
            <Search />
            <div className="flex flex-col gap-1 h-full overflow-y-scroll">
                {
                    icons.map((iconObj, index) => {
                        const IconComponent = iconObj.component;
                        return (
                            <Link href={iconObj.url} passHref key={index}>
                                <div className="mb-1">
                                    <div className={`flex gap-3 items-center p-2 capitalize ${iconObj.url === path ? 'border-l-[3px] border-[#0dce16] bg-[#033a0552] font-semibold' : 'hover:border-l-[3px] hover:border-[#0dce16] hover:bg-[#033a0552]'}`}>
                                        <IconComponent className="text-[15pt]"/>
                                        {iconObj.label}
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default SideBar;
