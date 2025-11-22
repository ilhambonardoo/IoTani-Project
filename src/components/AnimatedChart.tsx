"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AnimatedChartProps {
  title: string;
  data: Array<{
    date: string;
    suhu?: number;
    kelembapan?: number;
    pH?: number;
  }>;
  lines: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  animationSpeed?: "slow" | "normal" | "fast"; // NEW: Customize animation speed
}

export const AnimatedChart = ({
  title,
  data,
  lines,
  animationSpeed = "slow",
}: AnimatedChartProps) => {
  const [displayData, setDisplayData] = useState<typeof data>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isRealTime, setIsRealTime] = useState(false);
  const prevDataLengthRef = useRef(0);

  // Speed configuration: slow=300ms, normal=200ms, fast=100ms per point
  const speedConfig = {
    slow: 300,
    normal: 200,
    fast: 100,
  };

  const delayPerPoint = speedConfig[animationSpeed];

  // Handle real-time updates and initial animation
  useEffect(() => {
    if (data.length === 0) return;

    // Check if this is a real-time update (new data added to existing data)
    if (
      data.length > prevDataLengthRef.current &&
      prevDataLengthRef.current > 0
    ) {
      // Real-time update: directly show all data
      setIsRealTime(true);
      setDisplayData(data);
    } else if (prevDataLengthRef.current === 0 && data.length > 0) {
      // Initial load: start animation
      setIsRealTime(false);
      setIsAnimating(true);
      setDisplayData([]); // Reset to start animation from beginning
    } else if (data.length === prevDataLengthRef.current && !isRealTime) {
      // Data unchanged and not in real-time mode - keep current state
      return;
    }

    prevDataLengthRef.current = data.length;
  }, [data, isRealTime]);

  // Initial animation (only when not in real-time mode and animating)
  useEffect(() => {
    if (!isAnimating || data.length === 0 || isRealTime) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= data.length) {
        setDisplayData(data.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsAnimating(false);
      }
    }, delayPerPoint);

    return () => clearInterval(interval);
  }, [data, isAnimating, delayPerPoint, isRealTime]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-white p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-neutral-800">{title}</h3>
        {isRealTime ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-2 text-sm text-green-600"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span>Real-time</span>
          </motion.div>
        ) : isAnimating ? (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex items-center gap-2 text-sm text-blue-600"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span>Animating</span>
          </motion.div>
        ) : null}
      </div>

      <div className="w-full h-80 overflow-hidden rounded-lg bg-neutral-50">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <defs>
              {lines.map((line) => (
                <linearGradient
                  key={`gradient-${line.key}`}
                  id={`gradient-${line.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={line.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={line.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              style={{ fontSize: "12px" }}
            />
            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              cursor={{ stroke: "#9ca3af", strokeWidth: 2 }}
            />
            <Legend />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={3}
                fill={`url(#gradient-${line.key})`}
                dot={false}
                isAnimationActive={false}
                name={line.name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <p className="text-xs text-neutral-500">
          Total data points: {displayData.length}
        </p>
      </div>
    </motion.div>
  );
};
