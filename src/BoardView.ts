import * as _ from 'lodash';
import * as d3 from 'd3';
import {Board, Piece, Cell} from "./Chess";

export default class BoardView {
    public readonly cellSize = 50;

    private selector: string;
    private board: Board;

    constructor(selector: string, board: Board) {
        this.selector = selector;
        this.board = board;
        this.drawGrid();
        this.refresh();
    }

    drawGrid() {
        let container = d3.select(this.selector);
        container.selectAll("*").remove();

        let colors = ["white", "black"];
        for (let y = 0; y < Board.SIZE; y++) {
            let colorIndex = y % 2;
            let row = container.append("div")
                .classed("board-row", true);
            for (let x = 0; x < Board.SIZE; x++) {
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
        let pieces = container.selectAll(".piece").data(data, (d: any) => d.id);

        pieces.exit().remove();

        pieces.enter()
            .append("div")
            .attr("class", "piece")
            .style('left', (d) => (d.cell.x * this.cellSize) + "px")
            .style('top', (d) => (d.cell.y * this.cellSize) + "px")
            .append("img").attr("src", (d) => "img/piece/" + d.type + "" + d.player + ".svg");

        container.selectAll(".piece").data(data, (d: any) => d.id).merge(pieces)
            .transition().duration(250).ease(d3.easeLinear)
            .style('left', (d) => (d.cell.x * this.cellSize) + "px")
            .style('top', (d) => (d.cell.y * this.cellSize) + "px");

        for (let y = 0; y < Board.SIZE; y++) {
            for (let x = 0; x < Board.SIZE; x++) {
                let cell = new Cell(x, y);
                let value = this.board.getSelection(cell);
                d3.select("#cell-" + cell.id()).classed("selected", value);
            }
        }
    }


}