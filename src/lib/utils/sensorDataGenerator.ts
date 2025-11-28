export interface SensorDataPoint {
  date: string;
  suhu: number;
  kelembapan: number;
  pH: number;
}

export const generateData = (days: number): SensorDataPoint[] => {
  const data: SensorDataPoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      suhu: 25 + Math.random() * 5,
      kelembapan: 60 + Math.random() * 20,
      pH: 6.5 + Math.random() * 1,
    });
  }
  return data;
};

export const generateNewDataPoint = (): SensorDataPoint => {
  const now = new Date();
  return {
    date: now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    suhu: 25 + Math.random() * 5,
    kelembapan: 60 + Math.random() * 20,
    pH: 6.5 + Math.random() * 1,
  };
};

export const generateNewDataPointTable = (): SensorDataPoint => {
  const now = new Date();
  return {
    date: now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    suhu: 25 + Math.random() * 5,
    kelembapan: 60 + Math.random() * 20,
    pH: 6.5 + Math.random() * 1,
  };
};

// Get latest sensor values from data array
export const getLatestSensorData = (
  data: SensorDataPoint[]
): {
  temperature: number;
  moisture: number;
  pH: number;
} => {
  if (data.length === 0) {
    // Default values if no data
    return {
      temperature: 25 + Math.random() * 5,
      moisture: 60 + Math.random() * 20,
      pH: 6.5 + Math.random() * 1,
    };
  }

  const latest = data[data.length - 1];
  return {
    temperature: latest.suhu,
    moisture: latest.kelembapan,
    pH: latest.pH,
  };
};

export const generateWeatherData = (): {
  temperature: number;
  humidity: number;
  condition: "sunny" | "cloudy" | "rainy";
  windSpeed: number;
} => {
  const temperature = 25 + Math.random() * 5;
  const humidity = 60 + Math.random() * 20;
  const windSpeed = 10 + Math.random() * 10;

  let condition: "sunny" | "cloudy" | "rainy";
  const random = Math.random();

  if (humidity > 80 && random > 0.3) {
    condition = "rainy";
  } else if (humidity > 70 && random > 0.6) {
    condition = "cloudy";
  } else {
    condition = "sunny";
  }

  return {
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity),
    condition,
    windSpeed: Math.round(windSpeed),
  };
};
