import { cn } from '@/lib/utils'
import React from 'react'

interface HomeCardProps{
    className: string,
    title: string,
    description: string,
    handleClick: () => void
}

const HomeCard = ({className, title, description, handleClick}: HomeCardProps) => {
    return (
        <div className={cn('px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer', className)}
            onClick={handleClick}>
            <div className='bg-zinc-100 size-12 rounded-[10px]'>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className='text-xl font-bold'>{title}</h1>
                <p className=''>{description}</p>
            </div>
        </div>
    )
}

export default HomeCard