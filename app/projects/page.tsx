import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ProjectMade from '@/components/ProjectMade'
const page = () => {
    return (

        <div className=''>
            <div className="flex justify-between items-start">
                <div className="rounded-md">
                    <p className='text-[14pt] font-bold'>Projects</p>
                </div>
                <div className="flex gap-4">
                    <Link href={"addProject"}>
                        <div className="border rounded-md p-2 hover:bg-zinc-800 flex gap-3">
                            <Plus className="h-[1.2rem] w-[1.2rem] dark:scale-100" />
                            <p>Add Project</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className='mt-3'>
                <ProjectMade />
            </div>
        </div>
    )
}

export default page