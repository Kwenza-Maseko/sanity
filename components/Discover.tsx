'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Ensure you import the Image component

interface Images {
    id: number;
    tags: string;
    webformatURL: string; // Use webformatURL for images
}

export default function Discover() {
    const [images, setImages] = useState<Images[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [columns, setColumns] = useState(3); // Default to 3 columns

    useEffect(() => {
        const fetchImages = async () => {
            const res = await fetch('/api/discover');
            if (res.ok) {
                const data = await res.json();
                setImages(data.hits.slice(0, 9)); // Fetch and display only the first 9 images
            } else {
                console.error('Failed to fetch images');
            }
            setIsLoading(false);
        };

        fetchImages();
    }, []);

    // Function to group images into columns based on screen size
    const groupImages = (images: Images[], columns: number) => {
        const grouped: Images[][] = [];
        for (let i = 0; i < columns; i++) {
            grouped.push([]);
        }

        images.forEach((image, index) => {
            grouped[index % columns].push(image); // Distribute images evenly into columns
        });

        return grouped;
    };

    // Function to adjust the number of columns based on screen size
    useEffect(() => {
        const updateColumns = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth < 768) {
                setColumns(2); // Use 2 columns for small screens
            } else {
                setColumns(3); // Use 3 columns for larger screens
            }
        };

        updateColumns(); // Run the function initially
        window.addEventListener('resize', updateColumns); // Listen for window resize

        return () => window.removeEventListener('resize', updateColumns); // Cleanup listener
    }, []);

    const groupedImages = groupImages(images, columns); // Group images based on the current number of columns

    return (
        <>
            <div className="p-4 flex justify-center gap-1 sm:gap-2">
                {!isLoading && images.length > 0 ? (
                    groupedImages.map((columnImages, columnIndex) => (
                        <div 
                            key={columnIndex} 
                            className={`flex flex-col gap-1 sm:gap-2 w-full sm:w-1/2 lg:w-1/3`} // Adjusts width based on screen size
                        >
                            {columnImages.map((image) => (
                                <div key={image.id} className="w-fit relative">
                                    <Image
                                        src={image.webformatURL}
                                        width={300}
                                        height={300}
                                        alt={image.tags}
                                        className="rounded-lg w-full"
                                    />
                                    <div className="absolute right-0 left-0 bottom-0 bg-[#1313665d] rounded-b-lg p-2 hidden lg:block">
                                        <p className="text-[13pt] font-semibold text-white capitalize">{image.tags}</p> 
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-screen text-2xl">
                        <div className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-[250px] rounded-xl skeleton" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px] skeleton" />
                                <Skeleton className="h-4 w-[200px] skeleton" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
