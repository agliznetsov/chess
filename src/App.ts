import * as d3 from 'd3';
import * as _ from 'lodash';
import * as $ from 'jquery';

import MessageBus from './MessageBus';
import BarChart from './BarChart';
import LineChart from './LineChart';
import {Board, Cell, Piece, Move, PieceType, GameStatus} from './Chess';
import BoardView from './BoardView';
// import {AI, MTS_AI, MiniMaxAI} from './AI';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../main.css";
import {MonteCarloTreeSearch} from "./MonteCarloTreeSearch";
import {MiniMaxAI} from "./MiniMax";

class App {
    private barChart;
    private lineChart;
    private boardView: BoardView;
    private board: Board;
    private selectedPiece: Piece;
    private timer;
    private iteration: number;
    private confidences;
    private ai: MonteCarloTreeSearch;
    private aiSettings;
    private stop;
    private start;
    private aiResult;

    init() {
        $('#restart').click(this.restart.bind(this));
        $('#undo').click(this.undo.bind(this));
        $('#analyze').click(this.analyze.bind(this));
        // $('#save').click(this.save.bind(this));
        // $('#load').click(this.load.bind(this));
        // $('#settings').click(this.configure.bind(this));

        $('#board').click(this.onBoardClick.bind(this));


        this.barChart = new BarChart('#moves-chart');
        this.lineChart = new LineChart('#line-chart');
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
                } else {
                    this.selectPiece(cell);
                }
            } else {
                this.selectPiece(cell);
            }
            this.refresh();
        }
        // if (!this.board.win && !this.board.get(cell.x, cell.y) && !this.timer) {
        //     this.makeMove(cell.x, cell.y);
        //     if (!this.board.win) {
        //         this.analyze();
        //     }
        // }
    }

    private selectPiece(cell: Cell) {
        let piece = this.board.getCell(cell);
        if (piece && piece.player == this.board.player) {
            this.selectedPiece = piece;
            this.board.setSelection(piece.cell, true);
            piece.moves.forEach(c => this.board.setSelection(c, true));
        } else {
            this.selectedPiece = null;
        }
    }

    getClickedCell(e): Cell {
        let parent = $('#board').offset();
        let y = Math.floor((e.pageY - parent.top) / this.boardView.cellSize);
        let x = Math.floor((e.pageX - parent.left) / this.boardView.cellSize);
        return new Cell(x, y);
    }

    makeMove(move: Move) {
        this.board.makeMove(move);
        this.refresh();
    }

    analyze() {
        if (!this.timer) {
            this.confidences = [];
            this.lineChart.reset();
            this.iteration = 0;

            // this.ai = new MonteCarloTreeSearch(this.board);
            // this.stop = false;
            this.start = new Date().getTime();
            let ai = new MiniMaxAI(this.board, 3);
            let move = ai.findMove();
            let time = (new Date().getTime() - this.start) / 1000;
            $('#time').text(this.format(time, 2));
            this.makeMove(move.move);

            // this.timer = d3.timer(this.onTimer.bind(this));
            // $('#analyze > i').attr('class', 'fa fa-stop');
        } else {
            this.stop = true;
        }
    }

    onTimer(elapsed) {
        try {
            let frameStart = new Date().getTime();
            while (new Date().getTime() - frameStart < 50) { //20 fps
                this.ai.step();
                this.iteration++;
            }
            this.aiResult = this.ai.getResult();
            let time = (new Date().getTime() - this.start) / 1000;
            this.barChart.refresh(this.aiResult);
            this.boardView.refresh();
            this.lineChart.addDataPoint(this.aiResult.confidence);

            $('#iterations').text(this.iteration);
            $('#confidence').text(this.format(this.aiResult.confidence, 2));
            $('#time').text(this.format(time, 2));

            let settings = {iterations: 100};
            if (this.stop
                || (this.aiResult.moves.length === 1)
                // || (settings.timeout > 0 && elapsed >= settings.timeout * 1000)
                // || (settings.confidence > 0 && this.aiResult.confidence >= settings.confidence)
                || (settings.iterations > 0 && this.iteration >= settings.iterations)) {
                // console.log('it/sec', this.iteration / time);
                let move = this.aiResult.moves[0].move as Move;
                this.makeMove(move);
                this.stopTimer();
            }
        } catch (e) {
            console.error(e);
            this.stopTimer();
        }
    }

    stopTimer() {
        if (this.timer) {
            this.timer.stop();
            this.timer = undefined;
            $('#analyze > i').attr('class', 'fa fa-play');
        }
    }

    format(value: number, digits: number) {
        return value.toFixed(digits);
    }

    refresh() {
        this.boardView.refresh();
        d3.select("#player").attr("src", "img/piece/" + PieceType.King + "" + this.board.player + ".svg");
        let status = "";
        if (this.board.status == GameStatus.Checkmate) {
            status = "Checkmate!";
        } else if (this.board.status == GameStatus.Stalemate) {
            status = "Stalemate!";
        } else if (this.board.getKing(this.board.player).checked) {
            status = "Check!";
        }
        d3.select("#status").text(status);
    }

    restart() {
        this.stopTimer();
        // let game = $('#game').val();
        this.board.init();
        this.refresh();
    }

    undo() {
        this.stopTimer();
        this.board.undo();
        this.refresh();
    }

}

new App().init();