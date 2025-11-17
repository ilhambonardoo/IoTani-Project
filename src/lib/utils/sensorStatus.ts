
export interface SensorStatus {
  status: "normal" | "warning" | "critical";
  message: string;
  severity: "low" | "medium" | "high";
}

export function checkpHStatus(pH: number): SensorStatus {
  if (pH >= 6.0 && pH <= 7.5) {
    return {
      status: "normal",
      message: "pH tanah dalam kondisi optimal",
      severity: "low",
    };
  } else if ((pH >= 5.5 && pH < 6.0) || (pH > 7.5 && pH <= 8.0)) {
    return {
      status: "warning",
      message: pH < 6.0 
        ? `pH tanah terlalu asam (${pH.toFixed(1)}). Nilai optimal: 6.0 - 7.5`
        : `pH tanah terlalu basa (${pH.toFixed(1)}). Nilai optimal: 6.0 - 7.5`,
      severity: "medium",
    };
  } else {
    return {
      status: "critical",
      message: pH < 5.5
        ? `⚠️ KRITIS: pH tanah sangat asam (${pH.toFixed(1)})! Perlu penanganan segera. Nilai optimal: 6.0 - 7.5`
        : `⚠️ KRITIS: pH tanah sangat basa (${pH.toFixed(1)})! Perlu penanganan segera. Nilai optimal: 6.0 - 7.5`,
      severity: "high",
    };
  }
}


export function checkMoistureStatus(moisture: number): SensorStatus {
  if (moisture >= 50 && moisture <= 80) {
    return {
      status: "normal",
      message: "Kelembaban tanah dalam kondisi optimal",
      severity: "low",
    };
  } else if ((moisture >= 40 && moisture < 50) || (moisture > 80 && moisture <= 90)) {
    return {
      status: "warning",
      message: moisture < 50
        ? `Kelembaban tanah rendah (${moisture}%). Nilai optimal: 50% - 80%`
        : `Kelembaban tanah tinggi (${moisture}%). Nilai optimal: 50% - 80%`,
      severity: "medium",
    };
  } else {
    return {
      status: "critical",
      message: moisture < 40
        ? `⚠️ KRITIS: Kelembaban tanah sangat kering (${moisture}%)! Perlu penyiraman segera. Nilai optimal: 50% - 80%`
        : `⚠️ KRITIS: Kelembaban tanah sangat basah (${moisture}%)! Perlu drainase segera. Nilai optimal: 50% - 80%`,
      severity: "high",
    };
  }
}

export function checkTemperatureStatus(temperature: number): SensorStatus {
  if (temperature >= 20 && temperature <= 30) {
    return {
      status: "normal",
      message: "Suhu tanah dalam kondisi optimal",
      severity: "low",
    };
  } else if ((temperature >= 15 && temperature < 20) || (temperature > 30 && temperature <= 35)) {
    return {
      status: "warning",
      message: temperature < 20
        ? `Suhu tanah rendah (${temperature}°C). Nilai optimal: 20°C - 30°C`
        : `Suhu tanah tinggi (${temperature}°C). Nilai optimal: 20°C - 30°C`,
      severity: "medium",
    };
  } else {
    return {
      status: "critical",
      message: temperature < 15
        ? `⚠️ KRITIS: Suhu tanah sangat dingin (${temperature}°C)! Perlu perhatian khusus. Nilai optimal: 20°C - 30°C`
        : `⚠️ KRITIS: Suhu tanah sangat panas (${temperature}°C)! Perlu perhatian khusus. Nilai optimal: 20°C - 30°C`,
      severity: "high",
    };
  }
}

export function getOverallSensorStatus(
  pH: number,
  moisture: number,
  temperature: number
): "normal" | "warning" | "critical" {
  const pHStatus = checkpHStatus(pH);
  const moistureStatus = checkMoistureStatus(moisture);
  const temperatureStatus = checkTemperatureStatus(temperature);

  if (
    pHStatus.status === "critical" ||
    moistureStatus.status === "critical" ||
    temperatureStatus.status === "critical"
  ) {
    return "critical";
  }

  if (
    pHStatus.status === "warning" ||
    moistureStatus.status === "warning" ||
    temperatureStatus.status === "warning"
  ) {
    return "warning";
  }

  return "normal";
}

export function getAbnormalSensorNotifications(
  pH: number,
  moisture: number,
  temperature: number
): Array<{
  id: string;
  type: "warning" | "critical";
  sensor: "pH" | "moisture" | "temperature";
  message: string;
  value: number;
  unit: string;
  severity: "low" | "medium" | "high";
}> {
  const notifications: Array<{
    id: string;
    type: "warning" | "critical";
    sensor: "pH" | "moisture" | "temperature";
    message: string;
    value: number;
    unit: string;
    severity: "low" | "medium" | "high";
  }> = [];

  const pHStatus = checkpHStatus(pH);
  if (pHStatus.status !== "normal") {
    notifications.push({
      id: "ph-" + pH,
      type: pHStatus.status,
      sensor: "pH",
      message: pHStatus.message,
      value: pH,
      unit: "",
      severity: pHStatus.severity,
    });
  }

  const moistureStatus = checkMoistureStatus(moisture);
  if (moistureStatus.status !== "normal") {
    notifications.push({
      id: "moisture-" + moisture,
      type: moistureStatus.status,
      sensor: "moisture",
      message: moistureStatus.message,
      value: moisture,
      unit: "%",
      severity: moistureStatus.severity,
    });
  }

  const temperatureStatus = checkTemperatureStatus(temperature);
  if (temperatureStatus.status !== "normal") {
    notifications.push({
      id: "temperature-" + temperature,
      type: temperatureStatus.status,
      sensor: "temperature",
      message: temperatureStatus.message,
      value: temperature,
      unit: "°C",
      severity: temperatureStatus.severity,
    });
  }

  return notifications;
}

