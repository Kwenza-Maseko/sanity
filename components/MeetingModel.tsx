'use client'
import React, { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface MeetingModelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    className?: string;
    children?: ReactNode;
    handleClick?: () => void;
    buttonText?: string;
    buttonIcon?: string
}

const MeetingModel = ({ isOpen, onClose, title, className, children, handleClick, buttonText }: MeetingModelProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogTitle></DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-6'>
                    <h1 className={cn('text-xl font-bold leading-[42px]', className)}>{title}</h1>
                    {children}
                    <Button className='focus-visible:ring-0 focus-visible:ring-offset-0'
                    onClick={handleClick}>
                        {buttonText || "Schedule Meeting"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default MeetingModel