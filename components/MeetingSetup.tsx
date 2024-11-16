'use client';

import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

type MeetingSetupProps = {
    setIsSetupComplete: React.Dispatch<React.SetStateAction<boolean>>;
};

const MeetingSetup: React.FC<MeetingSetupProps> = ({ setIsSetupComplete }) => {
    const call = useCall();
    const [isMicToogleOn, setIsMicToogleOn] = useState(false);

    useEffect(() => {
        if (call?.camera && call?.microphone) {
            if (isMicToogleOn) {
                call.camera.disable();
                call.microphone.disable();
            } else {
                call.camera.enable();
                call.microphone.enable();
            }
        }
    }, [isMicToogleOn, call]);

    if (!call) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <h1 className="text-xl font-bold text-red-500">
                    Unable to initialize call. Please try again later.
                </h1>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
            <h1 className="text-xl font-bold">Setup</h1>
            <VideoPreview />
            <div className="flex h-16 items-center justify-center gap-3">
                <label className="flex items-center justify-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        checked={isMicToogleOn}
                        onChange={(e) => setIsMicToogleOn(e.target.checked)}
                    />
                    Join with mic and camera off
                </label>
                <DeviceSettings />
            </div>
            <Button
                className="rounded-md px-4 py-2.5"
                onClick={async () => {
                    try {
                        await call.join();
                        setIsSetupComplete(true);
                    } catch (error) {
                        console.error('Failed to join call:', error);
                        alert('Unable to join the call. Please try again.');
                    }
                }}
            >
                Join meeting
            </Button>
        </div>
    );
};

export default MeetingSetup;
