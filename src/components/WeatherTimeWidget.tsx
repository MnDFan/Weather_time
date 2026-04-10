'use client';

import React from 'react';
import { useWeather, useTime } from '../hooks';
import { WeatherDisplay } from './WeatherDisplay';
import { TimeDisplay } from './TimeDisplay';
import { WeatherWidgetProps } from '../types';

export function WeatherTimeWidget({
  latitude,
  longitude,
  className = '',
  showTime = true,
  showWeather = true,
  units = 'metric',
  refreshInterval = 600000,
  weatherApiUrl,
}: WeatherWidgetProps) {
  const { weather, error, loading } = useWeather(
    { latitude, longitude },
    refreshInterval,
    weatherApiUrl
  );

  if (error) {
    return (
      <div className={`p-4 bg-red-900 border border-red-700 rounded-lg ${className}`}>
        <p className="text-red-300 font-semibold">Weather Error</p>
        <p className="text-red-400 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div
      className={`weather-time-widget bg-black rounded-lg shadow-lg shadow-red-500/20 p-6 border border-red-800 ${className}`}
    >
      {showTime && (
        <div className="mb-6">
          <TimeDisplay
            timezone={weather?.timezone}
            showDate={true}
            format="24h"
          />
        </div>
      )}

      {showWeather && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            </div>
          ) : weather ? (
            <WeatherDisplay data={weather} units={units} />
          ) : null}
        </div>
      )}

      <div className="mt-6 text-center text-red-300 italic">
        <p>Pendant que vous jouiez aux héros… j'écrivais les règles du jeu.</p>
        <p>Et maintenant, vous avez déjà perdu</p>
      </div>
    </div>
  );
}
