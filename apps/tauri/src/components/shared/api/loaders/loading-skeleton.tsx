import { useState, useEffect } from 'react';
export const MultiStepLoader = ({
    loadingStates,
    loading,
    onComplete,
    duration = 2000,
}: {
    loadingStates: { text: string }[];
    loading: boolean;
    onComplete?: () => void;
    duration?: number;
}) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        if (!loading) {
            setProgress(0);
            setComplete(false);
            return;
        }

        // Get random non-repeating messages
        const usedIndices = new Set();
        const getRandomMessage = () => {
            // If we've used all messages, reset
            if (usedIndices.size >= loadingStates.length - 1) {
                usedIndices.clear();
            }

            // Get a random index we haven't used yet
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * loadingStates.length);
            } while (usedIndices.has(randomIndex));

            usedIndices.add(randomIndex);
            return loadingStates[randomIndex].text;
        };

        // Set initial message
        setCurrentMessage(getRandomMessage());

        // Update progress and messages at intervals
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 100 / (10000 / duration); // Adjust for smooth progress

                // Change message occasionally
                if (Math.random() < 0.3) {
                    setCurrentMessage(getRandomMessage());
                }

                if (newProgress >= 100) {
                    clearInterval(interval);
                    setComplete(true);
                    onComplete && onComplete();
                    return 100;
                }
                return newProgress;
            });
        }, duration / 50); // More frequent updates for smoother progress

        return () => clearInterval(interval);
    }, [loading, loadingStates.length, duration, onComplete]);

    if (!loading) return null;

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-md p-6">
                <div className="text-center">
                    <p className="text-lg font-medium text-foreground animate-fade-in">{currentMessage}</p>
                </div>
            </div>
        </div>
    );
};
