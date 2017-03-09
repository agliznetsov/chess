import * as d3 from 'd3';

export default class LineChart {
    private data;
    private minY;
    private maxY;
    private xScale;
    private yScale;
    private svg;
    private path;

    constructor(selector) {
        this.data = [];
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;

        let container = d3.select(selector);
        let node = container.node();
        let totalWidth = node.offsetWidth;
        let totalHeight = node.offsetHeight;
        let margin = {top: 2, right: 0, bottom: 2, left: 2};
        let width = totalWidth - margin.left - margin.right;
        let height = totalHeight - margin.top - margin.bottom;

        this.xScale = d3.scaleLinear()
            .domain([0, 0])
            .range([0, width]);

        this.yScale = d3.scaleLinear()
            .domain([0, 0])
            .range([height, 0]);

        this.svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        this.path = this.svg.append("path")
            .attr("class", "line")
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", "1.5px");
    }

    reset() {
        this.data = [];
        this.redraw();
        this.minY = Number.MAX_VALUE;
        this.maxY = Number.MIN_VALUE;
    }

    addDataPoint(y) {
        this.minY = Math.min(this.minY, y);
        this.maxY = Math.max(this.maxY, y);
        this.data.push({x: this.data.length + 1, y: y});
        this.redraw();
    }

    redraw() {
        // Adjust the x and y domain.
        this.xScale.domain([1, this.data.length]);
        this.yScale.domain([this.minY, this.maxY]);
        // Adjust all the <path> elements (lines).
        let line = d3.line()
            .x((d: any) => this.xScale(d.x))
            .y((d: any) => this.yScale(d.y));
        this.path.datum(this.data).attr("d", line);
    }
}