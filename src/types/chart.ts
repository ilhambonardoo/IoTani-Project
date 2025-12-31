export interface AnimatedChartProps {
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
  animationSpeed?: "slow" | "normal" | "fast";
}
