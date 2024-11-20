
'use client'
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { BsPeople } from "@react-icons/all-files/bs/BsPeople";
import { RiDashboardLine } from "@react-icons/all-files/ri/RiDashboardLine";
import { IoFolderOutline } from "@react-icons/all-files/io5/IoFolderOutline";
import { RiToolsFill } from "@react-icons/all-files/ri/RiToolsFill";
import { RiFileList3Line } from "@react-icons/all-files/ri/RiFileList3Line";
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
        <div className="w-[260px] p-2 h-svh overflow-y-hidden border-r-[7px] dark:border-slate-800 fixed left-0 bg-[#eeeded] dark:bg-[#010416d2]">
            <div className="pacifico-regular">
                <Link href="/" className="flex gap-3 pt-4 items-center">
                    <div className="rounded-md px-2 text-[15pt] bg-slate-100 border dark:bg-[#ffffff] dark:text-[#000000]">
                        <p>S</p>
                    </div>
                    <div>
                        <p className=" text-[15pt]">Sanity</p>
                    </div>
                </Link>
            </div>
            <div className="flex flex-col mt-8 gap-1 h-full overflow-y-scroll">
                {
                    icons.map((iconObj, index) => {
                        const IconComponent = iconObj.component;
                        return (
                            <Link href={iconObj.url} passHref key={index}>
                                <div className="mb-1">
                                    <div className={`flex gap-3 items-center p-3 capitalize ${iconObj.url === path ? 'border-l-[3px] border-[#6770a3] bg-[#04105586] font-semibold  rounded-r-md ' : ' rounded-md hover:bg-[#04105586]'}`}>
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
