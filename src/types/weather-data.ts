export type WeatherData = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: Record<string, any>;
  minutely: { dt: number; precipitation: number }[];
  hourly: object[];
  daily: object[];
  createdAt: Date;
};
