// components/CountdownTimer.tsx

'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({
  initialSeconds,
  onExpire,
  className = '',
}: CountdownTimerProps) {

    const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

    useEffect(() => {
        // I Am Resetting this when initialSeconds changes
        setSecondsLeft(initialSeconds)

        if (initialSeconds <= 0) {
            onExpire?.()
            return;
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    onExpire?.()
                    return 0;
                }
                return prev - 1;
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [initialSeconds, onExpire])

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(Math.max(0, totalSeconds) / 60)
        const secs = Math.max(0, totalSeconds) % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const isExpired = secondsLeft <= 0;

    return (
        <div className="text-center">
            {!isExpired ?
                <p className="text-sm text-secondary-9">
                    <span>Code expires in </span>
                    <span
                        className={`font-medium tracking-wider ${
                        isExpired ? 'text-red-700' : 'text-secondary-9'
                        } ${className}`}
                    >
                        {formatTime(secondsLeft)}
                    </span>
                </p>
                :
                <p className="text-sm text-[#616166] text-center">
                    Time expired.
                    <button onClick={() => {}} className="font-medium text-primary-6 lg:text-accent-6 mx-1">Resend</button>
                </p>
            }
        </div>
    )
}