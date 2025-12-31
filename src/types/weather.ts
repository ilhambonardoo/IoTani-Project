export interface WeatherData {
  temperature: number;
  humidity: number;
  condition: "sunny" | "rainy" | "cloudy";
  windSpeed: number;
}
