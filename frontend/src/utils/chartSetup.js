// Chart.js needs each chart part to be registered once before use.
// This file is imported a single time in main.jsx.
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";
ChartJS.defaults.color = '#64748b';

// Shared options so every chart looks consistent.
export const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 16 } },
  },
};

export const axisChartOptions = {
  ...baseChartOptions,
  scales: {
    x: { grid: { display: false } },
    y: { beginAtZero: true, grid: { color: '#eef2f7' } },
  },
};
