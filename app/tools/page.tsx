import AllTools from '@/components/AllTools'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className=''>
            <div className="flex justify-between items-start">
                <div className="rounded-md">
                    <p className='text-[14pt] font-bold'>Tools</p>
                </div>
                <div className="flex gap-4">
                    <Link href={"addTool"}>
                        <div className="border rounded-md p-2 hover:bg-zinc-800 flex gap-3">
                            <Plus className="h-[1.2rem] w-[1.2rem] dark:scale-100" />
                            <p>Add Tool</p>
                        </div>
                    </Link>
                </div>
            </div>
            <div className='mt-3'>
                <AllTools />
            </div>
        </div>
    )
}

export default page