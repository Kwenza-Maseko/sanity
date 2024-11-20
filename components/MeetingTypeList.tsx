'use client'
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeCard from './HomeCard';
import MeetingModel from './MeetingModel';
import { useToast } from "@/hooks/use-toast"
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { IoVideocamOutline } from "@react-icons/all-files/io5/IoVideocamOutline";
import { BsPeople } from "@react-icons/all-files/bs/BsPeople";
import { MdSchedule } from "@react-icons/all-files/md/MdSchedule";
import { Input } from "@/components/ui/input"

const MeetingTypeList = () => {
    const { toast } = useToast()
    const route = useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const { user } = useUser();
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    });
    const [callDetails, setCallDetails] = useState<Call>();

    const createMeeting = async () => {
        if (!client || !user) return;

        try {
            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error('Failed to create call');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant meeting"

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })
            setCallDetails(call);

            if (!values.description) {
                route.push(`/meeting/${call.id}`);
            }
            toast({
                title: "Meeting Created"
            })
        } catch (error) {
            console.log(error)
            toast({ title: "Failed to create a meeting" })
        }
    }
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    const joinMeeting = () => {
        if (!values.link) {
            toast({ title: "Please enter a valid meeting link" });
            return;
        }

        try {
            route.push(values.link); // Navigate to the provided meeting link
        } catch (error) {
            console.log(error);
            toast({ title: "Failed to join the meeting" });
        }
    };
    
    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard
                title="New Meeting"
                description="Start a instant meeting"
                handleClick={() => setMeetingState('isInstantMeeting')}
                className="bg-red-800"
                icon=<IoVideocamOutline />
            />
            <HomeCard
                title="Schedule Meeting"
                description="Plan your meeting"
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className="bg-red-950"
                icon=<MdSchedule />
            />
            <HomeCard
                title="Join Meeting"
                description="Start a instant meeting"
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className="bg-emerald-400"
                icon=<BsPeople />
            />

            {!callDetails ? (
                <MeetingModel
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Create meeting"
                    handleClick={createMeeting}
                >
                    <div className="flex flex-col gap-2.5">
                        <label className='text-base text-normal leading-[22px]'>
                            Meeting description
                        </label>

                        <Textarea className=' docus-visble:ring-offset-0'
                            onChange={(e) => { setValues({ ...values, description: e.target.value }) }
                            } />
                    </div>
                    <div className="flex w-full flex-col gap-2.5">
                        <label>Select Date and Time</label>

                        <ReactDatePicker
                            selected={values.dateTime}
                            onChange={(date) => {
                                setValues({ ...values, dateTime: date! })
                            }}
                            showTimeSelect
                            timeFormat='HH:mm'
                            timeIntervals={15}
                            timeCaption='time'
                            dateFormat="MMMM d, yyyy h:mm aa"

                            className='w-full rounded p-2'
                        />
                    </div>
                </MeetingModel>
            ) : (
                <MeetingModel
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Meeting Created"
                    className="text-center"
                    buttonText="Copie meeting link"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                    }}
                />
            )}
            <MeetingModel
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />

            <MeetingModel
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Join meeting"
                buttonText="Join Meeting"
                handleClick={joinMeeting}
            >
                <div className="flex flex-col gap-2.5">
                    <label className='text-base text-normal leading-[22px]'>
                        Enter Meeting Link
                    </label>

                    <Input className=' docus-visble:ring-offset-0'
                        onChange={(e) => { setValues({ ...values, description: e.target.value }) }
                        } />
                </div>
            </MeetingModel>

        </section>
    )
}

export default MeetingTypeList