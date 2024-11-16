import MeetingTypeList from '@/components/MeetingTypeList'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-3'>
      <MeetingTypeList />
      <div className='flex gap-3'>
        <Link href={"/upcoming"}>
          Upcoming Meeting
        </Link>
        <Link href={"/previous"}>
          Previous
        </Link>
        <Link href={"/recordings"}>
          Recordings
        </Link>
      </div>
    </div>
  )
}

export default page