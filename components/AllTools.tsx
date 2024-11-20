'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

interface ToolData {
    toolName: string;
    toolType: string;
}

const AllTools = () => {
    const { isLoaded } = useUser();
    const [loading, setLoading] = useState(true);
    const [toolData, setToolData] = useState<ToolData[]>([]); // Expecting an array of tools

    const getTool = async () => {
        try {
            const response = await fetch(`/api/displayTool`);
            if (!response.ok) throw new Error("Failed to fetch tools");
            const data = await response.json();
            setToolData(data);
        } catch (error) {
            console.error("Error fetching tools:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTool();
    }, []); // Only run once on component mount

    if (loading || !isLoaded) {
        return <div>Loading Tools...</div>;
    }

    if (toolData.length === 0) {
        return <div>No tools available</div>;
    }

    // Group tools by toolType
    const groupedTools = toolData.reduce((acc, tool) => {
        if (!acc[tool.toolType]) {
            acc[tool.toolType] = [];
        }
        acc[tool.toolType].push(tool);
        return acc;
    }, {} as Record<string, ToolData[]>);

    return (
        <div className="flex flex-col gap-2">
            {Object.entries(groupedTools).map(([toolType, tools]) => (
                <div key={toolType}>
                    <h2 className="font-bold capitalize mb-2">{toolType}</h2>
                    <div className="flex gap-3">
                        {tools.map((tool, index) => (
                            <div key={index} className="flex gap-6 mb-4 border dark:border-slate-700 bg-zinc-200 dark:bg-[#02082c] p-3 rounded-md">
                                <p className="font-medium capitalize">{tool.toolName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AllTools;
