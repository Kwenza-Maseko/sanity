import { useGetCalls } from '@/hooks/useGetCalls';
import { useRouter } from 'next/navigation';
import MeetingCard from './MeetingCard';

interface Meeting {
  id: string;
  start_time?: string;
  url?: string; // Make url optional
  state?: {
    custom?: {
      description?: string;
    };
    startedAt?: Date;
  };
}

type CallListProps = {
  type: 'ended' | 'upcoming' | 'recordings';
};

const CallList = ({ type }: CallListProps) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();
  const router = useRouter();

  // Function to differentiate the calls based on the type
  const getCalls = (): Meeting[] => {
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

  const getNoCallsMessage = (): string => {
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
      {calls.length > 0 ? (
        calls.map((meeting, index) => (
          <MeetingCard
            key={meeting.id || index} // Using `meeting.id` as a key
            title={
              meeting.state?.custom?.description?.substring(0, 25) || 'No description'
            }
            date={
              meeting.state?.startedAt?.toDateString() ||
              new Date(meeting.start_time || Date.now()).toLocaleString()
            }
            isPreviousMeeting={type === 'ended'}
            buttonText={type === 'recordings' ? 'Play' : 'Start'}
            handleClick={
              type === 'recordings'
                ? () => router.push(`${meeting.url || '#'}`) // Fallback to '#' if url is undefined
                : () => router.push(`/meeting/${meeting.id}`)
            }
            link={
              type === 'recordings'
                ? (meeting.url || '#') // Provide fallback to '#' if url is undefined
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
