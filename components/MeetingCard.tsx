import React from 'react';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils'; 

interface MeetingCardProps {
    title: string;
    date: string;
    isPreviousMeeting?: boolean;
    buttonText?: string;
    handleClick: () => void;
    link: string;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
    title,
    date,
    isPreviousMeeting,
    buttonText,
    handleClick,
    link,
}) => {
    return (
        <section className="flex min-h-[258px] w-full flex-col justify-between rounded-md bg-slate-800 px-5 py-8 xl:max-w-[568px]">
            <article className="flex flex-col gap-5">
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-bold">{title}</h1>
                        <p className="text-base font-normal">{date}</p>
                    </div>
                </div>
            </article>

            <article className={cn('flex justify-center relative')}>
                <div className="absolute left-[136px] flex items-center justify-center size-10 rounded-full border-[5px] bg-slate-600 text-white">
                    +5
                </div>
                {!isPreviousMeeting && (
                    <div className="flex gap-2">
                        <Button onClick={handleClick}>{buttonText}</Button>
                        <Button
                            onClick={() => {
                                if (navigator.clipboard) {
                                    navigator.clipboard.writeText(link);
                                    toast({
                                        title: 'Link Copied',
                                    });
                                } else {
                                    toast({
                                        description: 'Unable to copy the link'
                                    });
                                }
                            }}
                            className="px-6"
                        >
                            Copy Link
                        </Button>
                    </div>
                )}
            </article>
        </section>
    );
};

export default MeetingCard;
