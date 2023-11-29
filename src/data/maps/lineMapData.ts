import { computed, ComputedRef, Ref } from '@vue/reactivity'
import { useColors } from 'vuestic-ui'

type GeoBounds = {
  bottom: number
  left: number
  right: number
  top: number
}

export type PointGeoCoord = {
  latitude: number
  longitude: number
}

export type DataGeometry = {
  geometry: {
    type: string
    coordinates: [number, number][]
  }
}

export type CityItem = {
  id?: string
  title: string
  country: string
  latitude: number
  longitude: number
  svgPath: string
  color: string
  flights?: PointGeoCoord[]
}

const targetSVG =
  'M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z'

export const planeSVG =
  'M19.671,8.11l-2.777,2.777l-3.837-0.861c0.362-0.505,0.916-1.683,0.464-2.135c-0.518-0.517-1.979,0.278-2.305,0.604l-0.913,0.913L7.614,8.804l-2.021,2.021l2.232,1.061l-0.082,0.082l1.701,1.701l0.688-0.687l3.164,1.504L9.571,18.21H6.413l-1.137,1.138l3.6,0.948l1.83,1.83l0.947,3.598l1.137-1.137V21.43l3.725-3.725l1.504,3.164l-0.687,0.687l1.702,1.701l0.081-0.081l1.062,2.231l2.02-2.02l-0.604-2.689l0.912-0.912c0.326-0.326,1.121-1.789,0.604-2.306c-0.452-0.452-1.63,0.101-2.135,0.464l-0.861-3.838l2.777-2.777c0.947-0.947,3.599-4.862,2.62-5.839C24.533,4.512,20.618,7.163,19.671,8.11z'

const tunas = {
  id: 'Las Tunas',
  color: 'info',
  svgPath: targetSVG,
  title: 'Las Tunas',
  country: 'Cuba',
  latitude: 20.96167,
  longitude: -76.95111,
  flights: [
    {
      latitude: 23.13302,
      longitude: -82.38304,
    },
    {
      latitude: 20.02083,
      longitude: -75.82667,
    },
    {
      latitude: 22.40694,
      longitude: -79.96472,
    },
    {
      latitude: 20.96167,
      longitude: -76.95111,
    },
    {
      latitude: 20.37417,
      longitude: -76.64361,
    },
    {
      latitude: 22.14957,
      longitude: -80.44662,
    },
    {
      latitude: 21.38083,
      longitude: -77.91694,
    },
    {
      latitude: 20.88722,
      longitude: -76.26306,
    },
    {
      latitude: 23.03661,
      longitude: -81.20596,
    },
    {
      latitude: 23.04111,
      longitude: -81.5775,
    },
    {
      latitude: 20.65776,
      longitude: -74.95075,
    },
    {
      latitude: 20.14444,
      longitude: -75.20917,
    },
    {
      latitude: 20.34173,
      longitude: -77.12126,
    },
    {
      latitude: 21.19517,
      longitude: -76.60358,
    },
    {
      latitude: 23.0881,
      longitude: -82.3597,
    },
    {
      latitude: 20.29879,
      longitude: -76.24511,
    },
    {
      latitude: 23.03811,
      longitude: -82.37703,
    },
  ],
}

const vilnius = {
  id: 'vilnius',
  color: 'info',
  svgPath: targetSVG,
  title: 'Vilnius',
  country: 'Cuba',
  latitude: 54.6896,
  longitude: 25.2799,
  flights: [
    {
      latitude: 23.13302,
      longitude: -82.38304,
    },
    {
      latitude: 59.9138,
      longitude: 10.7387,
    },
    {
      latitude: 40.4167,
      longitude: -3.7033,
    },
    {
      latitude: 50.0878,
      longitude: 14.4205,
    },
    {
      latitude: 48.2116,
      longitude: 17.1547,
    },
    {
      latitude: 44.8048,
      longitude: 20.4781,
    },
    {
      latitude: 55.7558,
      longitude: 37.6176,
    },
    {
      latitude: 37.9792,
      longitude: 23.7166,
    },
    {
      latitude: 51.5002,
      longitude: -0.1262,
    },
    {
      latitude: 53.3441,
      longitude: -6.2675,
    },
  ],
}

const cities: CityItem[] = [
  tunas,
  vilnius,
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'La Habana',
    country: 'Belgium',
    latitude: 23.13302,
    longitude: -82.38304,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Prague',
    country: 'Czech Republic',
    latitude: 20.02083,
    longitude: -75.82667,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Athens',
    country: 'Greece',
    latitude: 22.40694,
    longitude: -79.96472,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Reykjavik',
    country: 'Iceland',
    latitude: 20.96167,
    longitude: -76.95111,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Dublin',
    country: 'Ireland',
    latitude: 20.37417,
    longitude: -76.64361,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Oslo',
    country: 'Norway',
    latitude: 22.14957,
    longitude: -80.44662,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Lisbon',
    country: 'Portugal',
    latitude: 21.38083,
    longitude: -77.91694,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Moscow',
    country: 'Russia',
    latitude: 20.88722,
    longitude: -76.26306,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Belgrade',
    country: 'Serbia',
    latitude: 23.03661,
    longitude: -81.20596,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Bratislava',
    country: 'Slovakia',
    latitude: 23.04111,
    longitude: -81.5775,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Ljubljana',
    country: 'Slovenia',
    latitude: 20.65776,
    longitude: -74.95075,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Madrid',
    country: 'Spain',
    latitude: 20.14444,
    longitude: -75.20917,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Stockholm',
    country: 'Sweden',
    latitude: 20.34173,
    longitude: -77.12126,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Bern',
    country: 'Switzerland',
    latitude: 21.19517,
    longitude: -76.60358,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Kiev',
    country: 'Ukraine',
    latitude: 23.0881,
    longitude: -82.3597,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'Paris',
    country: 'France',
    latitude: 20.29879,
    longitude: -76.24511,
  },
  {
    svgPath: targetSVG,
    color: 'info',
    title: 'New York',
    country: 'Cuba',
    latitude: 23.03811,
    longitude: -82.37703,
  },
]

export const lineMapData = {
  cities,
  mainCity: tunas.title,
  homeCity: tunas.title,
}

export const useMapData = (data: Ref<CityItem[]>): ComputedRef<CityItem[]> => {
  const { getColor } = useColors()

  return computed(() =>
    data.value.map((item) => ({
      ...item,
      color: getColor(item.color),
    })),
  )
}

export const getGeoBounds = (item?: CityItem): GeoBounds | undefined => {
  if (!item || !item.flights || !item.flights.length) {
    return
  }

  const latitudes = [...item.flights.map(({ latitude }) => latitude), item.latitude]
  const longitudes = [...item.flights.map(({ longitude }) => longitude), item.longitude]

  return {
    bottom: Math.min(...latitudes),
    left: Math.min(...longitudes),
    right: Math.max(...longitudes),
    top: Math.max(...latitudes),
  }
}

export const generateLineSeriesData = (item?: CityItem): DataGeometry[] | undefined => {
  if (!item || !item.flights || !item.flights.length) {
    return
  }

  return item.flights.map((point) => ({
    geometry: {
      type: 'LineString',
      coordinates: [
        [item.longitude, item.latitude],
        [point.longitude, point.latitude],
      ],
    },
  }))
}

export const compareStrings = (first: string, second: string) => first.toLowerCase() === second.toLowerCase()
