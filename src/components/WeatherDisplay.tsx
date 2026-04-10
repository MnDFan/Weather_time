'use client';

import React from 'react';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
  Wind,
  Droplets,
} from 'lucide-react';
import { WeatherData } from '../types';
import { getWeatherDescription, getWeatherIcon } from '../utils/weatherUtils';

const ICON_MAP: Record<string, React.ReactNode> = {
  sun: <Sun className="w-12 h-12 text-yellow-400" />,
  cloud: <Cloud className="w-12 h-12 text-gray-400" />,
  'cloud-rain': <CloudRain className="w-12 h-12 text-blue-400" />,
  'cloud-snow': <CloudSnow className="w-12 h-12 text-blue-200" />,
  zap: <Zap className="w-12 h-12 text-yellow-500" />,
};

interface WeatherDisplayProps {
  data: WeatherData;
  units?: 'metric' | 'imperial';
  className?: string;
}

export function WeatherDisplay({
  data,
  units = 'metric',
  className = '',
}: WeatherDisplayProps) {
  const icon = getWeatherIcon(data.weatherCode);
  const description = getWeatherDescription(data.weatherCode);

  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'km/h' : 'mph';

  let displayTemp = data.temperature;
  let displayWind = data.windSpeed;

  if (units === 'imperial') {
    displayTemp = Math.round((data.temperature * 9) / 5 + 32);
    displayWind = Math.round(data.windSpeed * 2.237);
  } else {
    displayWind = Math.round(data.windSpeed * 3.6);
  }

  return (
    <div className={`weather-display ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-300 text-sm mb-1">{description}</h3>
          <p className="text-4xl font-bold text-white">
            {displayTemp}
            {tempUnit}
          </p>
        </div>
        <div>{ICON_MAP[icon] || ICON_MAP.cloud}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-gray-400">Humidity</p>
            <p className="text-sm font-semibold text-gray-200">
              {data.humidity}%
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Wind</p>
            <p className="text-sm font-semibold text-gray-200">
              {displayWind} {windUnit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
