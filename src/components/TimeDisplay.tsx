'use client';

import React, { useMemo } from 'react';
import { useTime } from '../hooks';

interface TimeDisplayProps {
  timezone?: string;
  className?: string;
  format?: '12h' | '24h';
  showDate?: boolean;
}

export function TimeDisplay({
  timezone,
  className = '',
  format = '24h',
  showDate = false,
}: TimeDisplayProps) {
  const time = useTime();

  const formattedTime = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: format === '12h',
    };

    return time.toLocaleTimeString('en-US', options);
  }, [time, timezone, format]);

  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return time.toLocaleDateString('en-US', options);
  }, [time, timezone]);

  return (
    <div className={`time-display ${className}`}>
      <p className="text-2xl font-semibold text-white">{formattedTime}</p>
      {showDate && <p className="text-sm text-gray-300 mt-1">{formattedDate}</p>}
    </div>
  );
}
