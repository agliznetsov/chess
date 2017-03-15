import * as d3 from 'd3';

import {Board, Cell, Piece, Move} from './Chess';

export const CELL_SIZE = 50;

export class BoardView {
    
    constructor(selector, board) {
        this.selector = selector;
        this.board = board;
        this.drawGrid();
        this.refresh();
    }

    drawGrid() {
        let container = d3.select(this.selector);
        container.selectAll("*").remove();

        let colors = ["white", "black"];
        for (let y = 0; y < 8; y++) {
            let colorIndex = y % 2;
            let row = container.append("div")
                .classed("board-row", true);
            for (let x = 0; x < 8; x++) {
                row.append("div")
                    .classed("cell", true)
                    .attr("id", "cell-" + Cell.ID(x, y))
                    .classed(colors[colorIndex], true);
                colorIndex = colorIndex == 0 ? 1 : 0;
            }
        }

    }

    refresh() {
        let container = d3.select(this.selector);
        let data = this.board.getPieces();
        let pieces = container.selectAll(".piece").data(data, (d) => d.id);

        pieces.exit().remove();

        pieces.enter()
            .append("div")
            .attr("class", "piece")
            .style('left', (d) => (d.cell.x * CELL_SIZE) + "px")
            .style('top', (d) => (d.cell.y * CELL_SIZE) + "px")
            .append("img").attr("src", (d) => "img/piece/" + d.type + "" + d.player + ".svg");

        container.selectAll(".piece").data(data, (d) => d.id).merge(pieces)
            .transition().duration(250).ease(d3.easeLinear)
            .style('left', (d) => (d.cell.x * CELL_SIZE) + "px")
            .style('top', (d) => (d.cell.y * CELL_SIZE) + "px");

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let cell = new Cell(x, y);
                let value = this.board.getSelection(cell);
                d3.select("#cell-" + cell.id()).classed("selected", value);
            }
        }
    }

}