# Weather Time Widget

> 🤝 **Ce repo accepte toute sorte de contributions et sont auto-approuvées, n'hésitez pas à contribuer !**

Un package React réutilisable pour afficher la météo et l'heure dans vos applications Next.js.

## Features

✨ **Composants**
- `WeatherTimeWidget` - Widget complet affichant la météo et l'heure
- `WeatherDisplay` - Composant pour afficher les données météorologiques
- `TimeDisplay` - Composant pour afficher l'heure

🎣 **Hooks**
- `useWeather` - Hook pour récupérer les données météorologiques
- `useTime` - Hook pour mettre à jour l'heure en temps réel

🌍 **API**
- Utilise l'API gratuite [Open-Meteo](https://open-meteo.com/) - aucune clé API requise!
- Support des unités métriques et impériales
- Mise en cache automatique des données

## Installation

```bash
npm install weather-time-widget
# ou
yarn add weather-time-widget
# ou
pnpm add weather-time-widget
```

## Utilisation rapide

### Widget complet

```tsx
import { WeatherTimeWidget } from 'weather-time-widget';

export default function Home() {
  return (
    <WeatherTimeWidget
      latitude={48.8566}
      longitude={2.3522}
      showTime={true}
      showWeather={true}
      units="metric"
    />
  );
}
```

### Utilisation dans un autre projet Next.js avec proxy API

Si ton site a une politique CSP stricte (ou bloque les appels externes), passe par une route API locale:

```tsx
import { WeatherTimeWidget } from 'weather-time-widget';

export default function Home() {
  return (
    <WeatherTimeWidget
      latitude={48.8566}
      longitude={2.3522}
      weatherApiUrl="/api/weather"
    />
  );
}
```

Crée ensuite `app/api/weather/route.ts` dans ton projet Next.js:

```ts
import { NextRequest, NextResponse } from 'next/server';

const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  const targetUrl = `${OPEN_METEO_API}?${query}`;

  const response = await fetch(targetUrl, {
    next: { revalidate: 600 },
  });

  const body = await response.text();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      'content-type': response.headers.get('content-type') || 'application/json',
      'cache-control': 'public, s-maxage=600, stale-while-revalidate=60',
    },
  });
}
```

### Composants individuels

```tsx
import { WeatherDisplay, TimeDisplay } from 'weather-time-widget';
import { useWeather, useTime } from 'weather-time-widget';

export default function CustomWeather() {
  const { weather, loading, error } = useWeather({
    latitude: 48.8566,
    longitude: 2.3522,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <TimeDisplay timezone="Europe/Paris" showDate={true} />
      {weather && <WeatherDisplay data={weather} units="metric" />}
    </div>
  );
}
```

## API Reference

### `<WeatherTimeWidget />`

Composant complet affichant la météo et l'heure.

**Props:**
- `latitude: number` - Latitude du lieu
- `longitude: number` - Longitude du lieu
- `showTime?: boolean` - Afficher l'heure (défaut: true)
- `showWeather?: boolean` - Afficher la météo (défaut: true)
- `units?: 'metric' | 'imperial'` - Unités (défaut: 'metric')
- `className?: string` - Classes CSS personnalisées
- `refreshInterval?: number` - Intervalle de mise à jour en ms (défaut: 600000 = 10 min)
- `weatherApiUrl?: string` - Endpoint météo (défaut: Open-Meteo). Ex: `/api/weather` avec proxy Next.js

### `<WeatherDisplay />`

Affiche les données météorologiques détaillées.

**Props:**
- `data: WeatherData` - Données météorologiques
- `units?: 'metric' | 'imperial'` - Unités (défaut: 'metric')
- `className?: string` - Classes CSS personnalisées

### `<TimeDisplay />`

Affiche l'heure actuelle avec support de fuseau horaire.

**Props:**
- `timezone?: string` - Fuseau horaire IANA (ex: 'Europe/Paris')
- `format?: '12h' | '24h'` - Format de l'heure (défaut: '24h')
- `showDate?: boolean` - Afficher la date (défaut: false)
- `className?: string` - Classes CSS personnalisées

### `useWeather(coords, refreshInterval?, weatherApiUrl?)`

Hook pour récupérer les données météorologiques.

**Paramètres:**
- `coords: { latitude: number; longitude: number }` - Coordonnées du lieu
- `refreshInterval?: number` - Intervalle de mise à jour en ms (défaut: 600000)
- `weatherApiUrl?: string` - URL de l'API météo (défaut: Open-Meteo)

**Retourne:**
```typescript
{
  weather: WeatherData | null,
  error: WeatherError | null,
  loading: boolean
}
```

### `useTime(timezone?, updateInterval?)`

Hook pour mettre à jour l'heure en temps réel.

**Paramètres:**
- `timezone?: string` - Fuseau horaire IANA
- `updateInterval?: number` - Intervalle de mise à jour en ms (défaut: 1000)

**Retourne:** 
- `Date` - L'objet Date actuel

## Exemples

### Vue d'ensemble complète

```tsx
'use client';

import { WeatherTimeWidget } from 'weather-time-widget';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <WeatherTimeWidget
        latitude={48.8566}
        longitude={2.3522}
        className="md:col-span-2"
        units="metric"
      />
      
      <WeatherTimeWidget
        latitude={51.5074}
        longitude={-0.1278}
        showTime={false}
      />
      
      <WeatherTimeWidget
        latitude={40.7128}
        longitude={-74.0060}
        showTime={false}
      />
    </div>
  );
}
```

### Styles personnalisés

```tsx
import { WeatherTimeWidget } from 'weather-time-widget';

export default function StyledWidget() {
  return (
    <WeatherTimeWidget
      latitude={48.8566}
      longitude={2.3522}
      className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl shadow-xl"
    />
  );
}
```

## Données météorologiques

Les données retournées incluent:

- `temperature` - Température en °C
- `humidity` - Humidité (0-100%)
- `windSpeed` - Vitesse du vent en m/s
- `weatherCode` - Code météo WMO
- `isDay` - Jour ou nuit
- `timezone` - Fuseau horaire

## Codes météo WMO

Le package utilise les codes météo WMO standard:
- 0-3: Ciel clair à couvert
- 45-48: Brouillard
- 51-67: Pluie/bruine
- 71-86: Neige
- 80-82: Averses
- 95-99: Orages

## Dépendances

- `react` >= 18.0.0
- `next` >= 13.0.0
- `date-fns` - Utilitaires de date
- `lucide-react` - Icônes

## Licence

MIT

## Support

Pour les problèmes ou les demandes de fonctionnalités, veuillez créer une issue sur GitHub.

Clean PR test
