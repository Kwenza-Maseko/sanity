'use client'
import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react';
import { Item } from '@radix-ui/react-dropdown-menu';
import { useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal')
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipated, setShowParticipated] = useState(false);
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  if(callingState !== CallingState.JOINED) return <div>Loading CallingState...</div>

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />
      default:
        return <SpeakerLayout participantsBarPosition="right" />
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4'>
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>

        <div className={cn('h-[calc(100vh-86px)] hidden ml-2', { 'show-block': showParticipated })}>
          <CallParticipantsList onClose={() => setShowParticipated(false)} />
        </div>
      </div>

      <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
        <CallControls />

          <DropdownMenu>
            <div className="flex items-centet">
              <DropdownMenuTrigger className='cursor-pointer rounded-full px-4 py-2'>
                <LayoutList />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent >
              {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                <div key={index}>
                  <DropdownMenuItem className='cursor-pointer'
                    onClick={() => {
                      setLayout(item.toLowerCase() as CallLayoutType)
                    }}>
                    {item}
                  </DropdownMenuItem>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <CallStatsButton />
          <button
            onClick={() => setShowParticipated((prev) => !prev)}
          >
            <div className='cursor-pointer rounded-full px-4 py-2'>
              <Users />
            </div>
          </button>

          {
            !isPersonalRoom && <EndCallButton/>
          }
        </div>
    </section>
  )
}

export default MeetingRoom