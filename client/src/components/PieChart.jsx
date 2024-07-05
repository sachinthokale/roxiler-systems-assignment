/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "./resizeObserver";
import * as d3 from "d3";

const PieChart = ({ selectedDate }) => {
  const [pieData, setPieData] = useState([]);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const pieColor = "#ff0054";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { month } = selectedDate;
        const { data } = await axios.get(
          `http://localhost:5000/api/piechart?month=${month}`
        );
        setPieData(data.categories);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    if (!dimensions) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.style("background-color", "#022B3A").style("overflow", "visible");

    const radius = Math.min(dimensions.width, dimensions.height) / 2;
    const pieGenerator = d3.pie().value((d) => d.count);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    const values = pieData.map((d) => d.count);
    const minValue = d3.min(values);
    const maxValue = d3.max(values);

    const colorScale = d3
      .scaleLinear()
      .domain([minValue, maxValue])
      .range(["#ccc", pieColor]);

    const arcs = pieGenerator(pieData);

    svg
      .selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d) => colorScale(d.data.count))
      .attr("stroke", "#022B3A")
      .attr("stroke-width", 5)
      .attr(
        "transform",
        `translate(${dimensions.width / 2}, ${dimensions.height / 2})`
      )
      .on("mouseover", (event, d) => {
        const [x, y] = arcGenerator.centroid(d);

        // Append rectangle for the text background
        const rect = svg
          .append("rect")
          .attr("class", "tooltip-rect")
          .attr("x", dimensions.width / 2 - 70)
          .attr("y", dimensions.height / 2 - 70)
          .attr("width", 140)
          .attr("height", 100)
          .attr("fill", "none");

        // Append text
        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", dimensions.width / 2 + 200)
          .attr("y", dimensions.height / 2 - 50)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(`Category`)
          .attr("fill", "white");

        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", dimensions.width / 2 + 200)
          .attr("y", dimensions.height / 2 - 20)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(d.data.category)
          .attr("fill", "#fca311")
          .style("font-size", "16px");

        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", dimensions.width / 2 + 200)
          .attr("y", dimensions.height / 2 + 10)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(`Count`)
          .attr("fill", "white");

        svg
          .append("text")
          .attr("class", "tooltip")
          .attr("x", dimensions.width / 2 + 200)
          .attr("y", dimensions.height / 2 + 40)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .text(d.data.count)
          .attr("fill", "#00f5d4")
          .style("font-size", "16px");
      })
      .on("mouseout", () => {
        svg.selectAll(".tooltip").remove();
        svg.selectAll(".tooltip-rect").remove();
      });
  }, [pieData, dimensions, pieColor]);

  return (
    <div
      ref={wrapperRef}
      className="pl-1 w-full h-full flex justify-center bg-[#022B3A]"
    >
      <svg className="w-full h-full" ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;
