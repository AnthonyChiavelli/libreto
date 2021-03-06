const regions = {
  Argentina: 'π¦π·',
  Uruguay: 'πΊπΎ',
  Chile: 'π¨π±',
  Colombia: 'π¨π΄',
  'Central America': 'β¬',
  Bolivia: 'π§π΄',
  Venezuela: 'π»πͺ',
  Paraguay: 'π΅πΎ',
  Ecuador: 'πͺπ¨',
  'United Kingdom': 'π¬π§',
  Carribean: 'π΄',
  Mexico: 'π²π½',
  Panama: 'π΅π¦',
  'Puerto Rico': 'π΅π·',
  Andes: 'π',
  'Dominican Republic': 'π©π΄',
  'United States': 'πΊπΈ',
  'Latin America': 'πΊπΈ',
  'South America': 'πΊπΈ',
  Spain: 'πͺπΈ',
  'Southern Cone': 'β',
  'River Plate': 'πΆ',
  Unknown: 'β',
}

export default function (region: string): string {
  return isKeyOfObject<typeof regions>(region, regions) ? regions[region] : regions['Unknown']
}

function isKeyOfObject<T>(key: string | number | symbol, obj: T): key is keyof T {
  return key in obj
}
