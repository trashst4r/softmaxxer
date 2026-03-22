"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import type { ChartDataPoint } from "@/lib/chart-data";
import { generateChartData, calculatePeriodCompletion, calculateTrend } from "@/lib/chart-data";

interface ConsistencyChartProps {
  amTotal: number;
  pmTotal: number;
  refreshKey?: number;
  onRefresh?: () => void;
}

export function ConsistencyChart({ amTotal, pmTotal, refreshKey = 0 }: ConsistencyChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [period, setPeriod] = useState<7 | 14>(7);
  const [completion, setCompletion] = useState(0);
  const [trend, setTrend] = useState({ direction: "steady" as "up" | "down" | "steady", change: 0 });
  const [hoveredDay, setHoveredDay] = useState<ChartDataPoint | null>(null);

  // Create chart structure when period changes
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 96;
    const margin = { top: 0, right: 0, bottom: 20, left: 0 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear everything
    svg.selectAll("*").remove();

    // Generate data
    const data = generateChartData(period, amTotal, pmTotal);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

    // Create chart group
    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d.date)
      .attr("x", (d) => xScale(d.date)!)
      .attr("y", (d) => yScale(d.percentage))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.percentage))
      .attr("rx", 2)
      .attr("fill", (d) => (d.isToday ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.2)"))
      .on("mouseenter", function (event, d) {
        setHoveredDay(d);
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseleave", function () {
        setHoveredDay(null);
        d3.select(this).attr("opacity", 1);
      });

    // Create labels
    chart
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.date)! + xScale.bandwidth() / 2)
      .attr("y", chartHeight + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("fill", "hsl(var(--on-surface-variant))")
      .attr("font-weight", (d) => (d.isToday ? "600" : "400"))
      .text((d) => d.dateLabel);

    // Store scales for updates
    (svg.node() as any).__chartHeight = chartHeight;
    (svg.node() as any).__yScale = yScale;

    setCompletion(calculatePeriodCompletion(data));
    setTrend(calculateTrend(data, amTotal, pmTotal));
  }, [period]);

  // Update bar heights on adherence changes
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const chartHeight = (svg.node() as any).__chartHeight;
    const yScale = (svg.node() as any).__yScale;

    if (!chartHeight || !yScale) return;

    const data = generateChartData(period, amTotal, pmTotal);

    // Update each bar with smooth transition
    data.forEach((d) => {
      svg
        .select(`.bar[data-date="${d.date}"]`)
        .transition()
        .duration(200)
        .ease(d3.easeLinear)
        .attr("y", yScale(d.percentage))
        .attr("height", chartHeight - yScale(d.percentage))
        .attr("fill", d.isToday ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.2)");
    });

    setCompletion(calculatePeriodCompletion(data));
    setTrend(calculateTrend(data, amTotal, pmTotal));
  }, [refreshKey, amTotal, pmTotal]);

  return (
    <div className="p-8 bg-surface-container-low rounded-3xl relative overflow-hidden min-h-[280px]">
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-headline text-lg font-bold text-on-surface">Consistency</h3>
          <div className="inline-flex bg-surface-container p-1 rounded-lg text-xs">
            <button
              onClick={() => setPeriod(7)}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                period === 7
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setPeriod(14)}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                period === 14
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              14d
            </button>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant mb-6 min-h-[20px]">
          {hoveredDay
            ? `${hoveredDay.dateLabel}: ${hoveredDay.percentage}% complete`
            : `Last ${period} days adherence`}
        </p>

        <svg ref={svgRef} className="w-full h-24 mb-6" />

        <div className="flex justify-between items-center">
          <span className="text-3xl font-headline font-black text-primary min-w-[80px]">{completion}%</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary bg-primary-container px-3 py-1 rounded-full min-w-[80px] text-center">
            {trend.change > 0 ? (
              <>
                {trend.direction === "up" && `↑ +${trend.change}%`}
                {trend.direction === "down" && `↓ -${trend.change}%`}
                {trend.direction === "steady" && "→ Steady"}
              </>
            ) : (
              <span className="opacity-0">→ 0%</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
