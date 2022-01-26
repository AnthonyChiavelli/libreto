const regions = {
  Argentina: '🇦🇷',
  Uruguay: '🇺🇾',
  Chile: '🇨🇱',
  Colombia: '🇨🇴',
  'Central America': '✬',
  Bolivia: '🇧🇴',
  Venezuela: '🇻🇪',
  Paraguay: '🇵🇾',
  Ecuador: '🇪🇨',
  'United Kingdom': '🇬🇧',
  Carribean: '🌴',
  Mexico: '🇲🇽',
  Panama: '🇵🇦',
  'Puerto Rico': '🇵🇷',
  Andes: '🏔',
  'Dominican Republic': '🇩🇴',
  'United States': '🇺🇸',
  'Latin America': '🇺🇸',
  'South America': '🇺🇸',
  Spain: '🇪🇸',
  'Southern Cone': '↓',
  'River Plate': '🛶',
  Unknown: '❓',
}

export default function (region: string): string {
  return isKeyOfObject<typeof regions>(region, regions) ? regions[region] : regions['Unknown']
}

function isKeyOfObject<T>(key: string | number | symbol, obj: T): key is keyof T {
  return key in obj
}
