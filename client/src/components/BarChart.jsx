import axios from "axios";
import {
  axisBottom,
  axisLeft,
  format,
  max,
  scaleBand,
  scaleLinear,
  select,
} from "d3";
import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "./resizeObserver";

const BarChart = ({ selectedDate }) => {
  const svgRef = useRef(null);
  const wrapperRef = useRef();
  const [chartData, setChartData] = useState([]);
  const dimensions = useResizeObserver(wrapperRef);
  const margin = { top: 20, right: 30, bottom: 20, left: 110 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { month } = selectedDate;
        const { data } = await axios.get(
          `http://localhost:5000/api/barchart?month=${month}`
        );
        setChartData(data.priceRanges);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    svg.style("background-color", "#022B3A").style("overflow", "visible");

    if (!dimensions) return;

    // Define the xScale and yScale
    const xScale = scaleLinear()
      .domain([0, max(chartData, (d) => d.count)])
      .nice()
      .range([margin.left, dimensions.width - margin.right]);

    const yScale = scaleBand()
      .domain(chartData.map((d) => d.range))
      .range([dimensions.height - margin.bottom, margin.top])
      .padding(0.2);

    // Define the axes
    const xAxis = axisBottom(xScale)
      .ticks(max(chartData, (d) => d.count) * 2) // Double the number of ticks to get increments of 0.5
      .tickFormat(format(".1f"));
    const yAxis = axisLeft(yScale);

    // Append x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${dimensions.height - margin.bottom})`)
      .style("color", "white")
      .call(xAxis);

    // Append y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .style("color", "white")
      .call(yAxis);

    svg
      .selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", xScale(0))
      .attr("y", (d) => yScale(d.range))
      .attr("width", (d) => xScale(d.count) - xScale(0))
      .attr("height", yScale.bandwidth())
      .transition()
      .attr("fill", (d) => {
        if (d.count < 2) {
          return "#fca311";
        } else if (d.count <= 6) {
          // Updated condition to include count of 2
          return "#00f5d4";
        } else {
          return "#ff0054";
        }
      });
  }, [chartData, dimensions, margin]);

  return (
    <div ref={wrapperRef} className="flex w-full h-full">
      <svg className="w-full h-full" ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
