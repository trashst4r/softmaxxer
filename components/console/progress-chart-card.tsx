"use client";

import { useEffect, useState } from "react";
import { getScanHistory, type ScanHistoryEntry } from "@/lib/console-state";

type MetricKey = "acne_severity" | "oil_production" | "barrier_health" | "overall_condition";

interface MetricOption {
  key: MetricKey;
  label: string;
  color: string;
}

const METRICS: MetricOption[] = [
  { key: "acne_severity", label: "Acne Severity", color: "#ef4444" },
  { key: "barrier_health", label: "Barrier Health", color: "#3b82f6" },
  { key: "overall_condition", label: "Overall Condition", color: "#10b981" },
  { key: "oil_production", label: "Oil Production", color: "#f59e0b" },
];

export function ProgressChartCard() {
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("overall_condition");

  useEffect(() => {
    const history = getScanHistory();
    // Reverse so oldest is first (left to right on chart)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScanHistory(history.reverse());
  }, []);

  if (scanHistory.length < 2) {
    return (
      <div className="clinical-card space-y-4">
        <h2 className="clinical-label">Progress Chart</h2>
        <div className="text-sm text-muted">
          Complete 2 or more scans to view progress trends.
        </div>
      </div>
    );
  }

  const metric = METRICS.find((m) => m.key === selectedMetric) || METRICS[0];
  const dataPoints = scanHistory.map((scan) => scan.scores[selectedMetric]);

  // Chart dimensions
  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scale data
  const maxValue = 100;
  const minValue = 0;
  const valueRange = maxValue - minValue;

  // Create path
  const points = dataPoints.map((value, index) => {
    const x = padding.left + (index / (dataPoints.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
    return { x, y, value };
  });

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="clinical-card space-y-6">
      <div className="space-y-3">
        <h2 className="clinical-label">Progress Chart</h2>
        <div className="flex gap-2 flex-wrap">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={`text-xs px-3 py-1 rounded-sm border transition-colors ${
                selectedMetric === m.key
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative" style={{ width: "100%", maxWidth: "600px" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          style={{ maxHeight: "200px" }}
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="rgba(255,255,255,0.4)"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {/* Data line */}
          <path
            d={pathD}
            fill="none"
            stroke={metric.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r="4" fill={metric.color} />
              <circle cx={point.x} cy={point.y} r="3" fill="rgba(0,0,0,0.8)" />
            </g>
          ))}
        </svg>
      </div>

      <div className="text-xs text-muted">
        {scanHistory.length} scan{scanHistory.length === 1 ? "" : "s"} recorded •{" "}
        {selectedMetric === "barrier_health" ? "Higher is better" : "Tracking over time"}
      </div>
    </div>
  );
}
