//@ts-nocheck
'use client';
import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import MeetingCard from './MeetingCard';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
    const router = useRouter();

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls || [];
            case 'recordings':
                return callRecordings || [];
            case 'upcoming':
                return upcomingCalls || [];
            default:
                return [];
        }
    };

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'recordings':
                return 'No Recordings';
            case 'upcoming':
                return 'No Upcoming Calls';
            default:
                return '';
        }
    };

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording, index: number) => (
                    <MeetingCard
                        key={(meeting as Call).id || index}
                        title={
                            (meeting as Call).state?.custom?.description?.substring(0, 25) ||
                            'No description'
                        }
                        date={
                            (meeting as Call)?.state?.startedAt?.toDateString() ||
                            new Date((meeting as CallRecording)?.start_time || Date.now()).toLocaleString()
                        }
                        isPreviousMeeting={type === 'ended'}
                        buttonText={type === 'recordings' ? 'Play' : 'Start'}
                        handleClick={
                            type === 'recordings'
                                ? () => router.push(`${meeting.url}`)
                                : () => router.push(`/meeting/${meeting.id}`)
                        }
                        link={
                            type === 'recordings'
                                ? meeting.url
                                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`
                        }
                    />
                ))
            ) : (
                <div className="col-span-full text-center">
                    <h1>{noCallsMessage}</h1>
                </div>
            )}
        </div>
    );
};

export default CallList;
