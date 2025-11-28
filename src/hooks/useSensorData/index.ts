"use client";

import { useState, useEffect, useMemo } from "react";
import {
  generateData,
  generateNewDataPoint,
  getLatestSensorData,
  type SensorDataPoint,
} from "@/lib/utils/sensorDataGenerator";
import {
  getOverallSensorStatus,
  getAbnormalSensorNotifications,
  checkpHStatus,
  checkMoistureStatus,
  checkTemperatureStatus,
} from "@/lib/utils/sensorStatus";
import type { SensorData } from "@/types";

export function useSensorData() {
  const [sensorDataArray, setSensorDataArray] = useState<SensorDataPoint[]>([]);
  const [sensorData, setSensorData] = useState<SensorData>({
    pH: 6.5,
    moisture: 60,
    temperature: 25,
    status: "normal",
  });

  const overallStatus = useMemo(() => {
    return getOverallSensorStatus(
      sensorData.pH,
      sensorData.moisture,
      sensorData.temperature
    );
  }, [sensorData.pH, sensorData.moisture, sensorData.temperature]);

  const abnormalNotifications = useMemo(() => {
    return getAbnormalSensorNotifications(
      sensorData.pH,
      sensorData.moisture,
      sensorData.temperature
    );
  }, [sensorData.pH, sensorData.moisture, sensorData.temperature]);

  const pHStatus = useMemo(() => checkpHStatus(sensorData.pH), [sensorData.pH]);
  const moistureStatus = useMemo(
    () => checkMoistureStatus(sensorData.moisture),
    [sensorData.moisture]
  );
  const temperatureStatus = useMemo(
    () => checkTemperatureStatus(sensorData.temperature),
    [sensorData.temperature]
  );

  useEffect(() => {
    const initialData = generateData(50);
    setSensorDataArray(initialData);
    const latest = getLatestSensorData(initialData);
    setSensorData({
      pH: latest.pH,
      moisture: latest.moisture,
      temperature: latest.temperature,
      status: overallStatus,
    });
  }, [overallStatus]);

  useEffect(() => {
    setSensorData((prev) => ({
      ...prev,
      status: overallStatus,
    }));
  }, [overallStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPoint = generateNewDataPoint();
      setSensorDataArray((prev) => {
        const updated = [...prev, newPoint].slice(-50);
        const latest = getLatestSensorData(updated);
        setSensorData({
          pH: latest.pH,
          moisture: latest.moisture,
          temperature: latest.temperature,
          status: overallStatus,
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [overallStatus]);

  return {
    sensorData,
    sensorDataArray,
    overallStatus,
    abnormalNotifications,
    pHStatus,
    moistureStatus,
    temperatureStatus,
  };
}
