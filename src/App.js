import * as d3 from 'd3';
import * as _ from 'lodash';
$ = require("jquery");

import * as Chess from './Chess';
import {Board, Piece, Cell, Move} from './Chess';
import {BoardView, CELL_SIZE} from './BoardView';
// import {MiniMaxAI} from './MiniMax';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../main.css";

class App {

    constructor() {
        $('#restart').click(this.restart.bind(this));
        $('#save').click(this.save.bind(this));
        $('#load').click(this.load.bind(this));
        $('#undo').click(this.undo.bind(this));
        $('#analyze').click(this.analyze.bind(this));
        $('#board').click(this.onBoardClick.bind(this));
        this.board = new Board();
        this.boardView = new BoardView('#board', this.board);
        this.restart();
    }

    onBoardClick(e) {
        if (!this.board.status) {
            this.board.clearSelection();
            let cell = this.getClickedCell(e);
            if (this.selectedPiece) {
                if (this.selectedPiece.isValidMove(cell)) {
                    this.board.makeMove(new Move(this.selectedPiece.cell, cell));
                    if (!this.board.status) {
                        this.analyze();
                    }
                    this.selectedPiece = null;
                } else {
                    this.selectPiece(cell);
                }
            } else {
                this.selectPiece(cell);
            }
            this.refresh();
        }
    }

    selectPiece(cell) {
        let piece = this.board.getCell(cell);
        if (piece && piece.player == this.board.player) {
            this.selectedPiece = piece;
            this.board.setSelection(piece.cell, true);
            piece.moves.forEach(c => this.board.setSelection(c, true));
        } else {
            this.selectedPiece = null;
        }
    }

    getClickedCell(e) {
        let parent = $('#board').offset();
        let y = Math.floor((e.pageY - parent.top) / CELL_SIZE);
        let x = Math.floor((e.pageX - parent.left) / CELL_SIZE);
        return new Cell(x, y);
    }

    makeMove(move) {
        this.board.makeMove(move);
        this.refresh();
    }

    analyze() {
        let that = this;
        let worker = new Worker("ai.js");
        $('#analyze').prop("disabled", true);
        $('#status').append('<i id="spinner" class="fa fa-spinner fa-spin"></i>');
        worker.onmessage = function (e) {
            let move = JSON.parse(e.data);
            move.move = Move.fromString(move.move);
            $('#time').text(that.format(move.time, 2));
            $('#iterations').text(move.iterations);
            $('#spinner').remove();
            $('#analyze').prop("disabled", false);
            that.makeMove(move.move);
        };
        worker.postMessage(this.board.toString());
    }

    format(value, digits) {
        return value.toFixed(digits);
    }

    refresh() {
        this.boardView.refresh();
        d3.select("#player").attr("src", "img/piece/" + Chess.King + "" + this.board.player + ".svg");
        let status = "";
        if (this.board.status == Chess.Checkmate) {
            status = "Checkmate!";
        } else if (this.board.status == Chess.Stalemate) {
            status = "Stalemate!";
        } else if (this.board.getKing(this.board.player).checked) {
            status = "Check!";
        }
        d3.select("#status > label").text(status);
    }

    restart() {
        this.board.init();
        this.refresh();
    }

    save() {
        window.localStorage.setItem("board", this.board.toString());
    }

    load() {
        let str = window.localStorage.getItem("board");
        if (str) {
            this.board = Board.fromString(str);
            this.boardView.board = this.board;
        } else {
            this.board.init();
        }
        this.board.analyze();
        this.refresh();
    }

    undo() {
        this.board.undo();
        this.refresh();
    }

}


new App();

