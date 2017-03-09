import * as d3 from 'd3';
import * as _ from 'lodash';
import * as $ from 'jquery';

import MessageBus from './MessageBus';
import BarChart from './BarChart';
import LineChart from './LineChart';
import {Board, Cell, Piece, Move, PieceType} from './Chess';
import BoardView from './BoardView';
// import {AI, MTS_AI, MiniMaxAI} from './AI';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../main.css";

class App {
    private barChart;
    private lineChart;
    private boardView: BoardView;
    private board: Board;
    private selectedPiece: Piece;
    private timer;
    private iteration: number;
    private confidences;
    // private ai: AI;
    private aiSettings;
    private stop;
    private start;
    private aiResult;

    init() {
        $('#restart').click(this.restart.bind(this));
        // $('#analyze').click(this.analyze.bind(this));
        // $('#save').click(this.save.bind(this));
        // $('#load').click(this.load.bind(this));
        // $('#settings').click(this.configure.bind(this));
        // $('#game').change(this.restart.bind(this));

        $('#board').click(this.onBoardClick.bind(this));


        this.barChart = new BarChart('#moves-chart');
        this.lineChart = new LineChart('#line-chart');
        this.board = new Board();
        this.boardView = new BoardView('#board', this.board);
        this.restart();
    }

    onBoardClick(e) {
        this.board.clearSelection();
        let cell = this.getClickedCell(e);
        if (this.selectedPiece) {
            if (this.selectedPiece.isValidMove(cell)) {
                this.board.makeMove(new Move(this.selectedPiece.cell, cell));
            }
            this.selectedPiece = null;
        } else {
            let piece = this.board.getCell(cell);
            if (piece && piece.player == this.board.player) {
                this.selectedPiece = piece;
                this.board.setSelection(piece.cell, true);
                piece.moves.forEach(c => this.board.setSelection(c, true));
            }
        }
        this.refresh();
        // if (!this.board.win && !this.board.get(cell.x, cell.y) && !this.timer) {
        //     this.makeMove(cell.x, cell.y);
        //     if (!this.board.win) {
        //         this.analyze();
        //     }
        // }
    }

    getClickedCell(e): Cell {
        let parent = $('#board').offset();
        let y = Math.floor((e.pageY - parent.top) / this.boardView.cellSize);
        let x = Math.floor((e.pageX - parent.left) / this.boardView.cellSize);
        return new Cell(x, y);
    }

    // makeMove(x: number, y: number) {
    //     let cell = this.board.makeMove(x, y, this.player);
    //     this.board.findWinner(cell.x, cell.y);
    //     if (!this.board.win) {
    //         this.player = Board.nextPlayer(this.player);
    //     }
    //     this.refresh();
    // }

    // analyze() {
    //     if (!this.timer) {
    //         this.lineChart.reset();
    //         this.iteration = 0;
    //
    //         this.ai = new MTS_AI(this.board, this.player);
    //         this.stop = false;
    //         // this.ai = new MiniMaxAI(this.board, this.player);
    //         // this.stop = true;
    //
    //         this.start = new Date().getTime();
    //         this.confidences = [];
    //         this.timer = d3.timer(this.onTimer.bind(this));
    //         $('#analyze > i').attr('class', 'fa fa-stop');
    //     } else {
    //         this.stop = true;
    //     }
    // }

    // onTimer(elapsed) {
    //     try {
    //         let frameStart = new Date().getTime();
    //         while (new Date().getTime() - frameStart < 50) { //20 fps
    //             this.ai.step();
    //             this.iteration++;
    //         }
    //         this.aiResult = this.ai.getResult();
    //         let time = (new Date().getTime() - this.start) / 1000;
    //         this.barChart.refresh(this.aiResult);
    //         this.boardView.refresh({move: this.aiResult.moves[0].move, player: this.ai.player});
    //         this.lineChart.addDataPoint(this.aiResult.confidence);
    //
    //         $('#iterations').text(this.iteration);
    //         $('#confidence').text(this.format(this.aiResult.confidence, 2));
    //         $('#time').text(this.format(time, 2));
    //
    //         let settings = this.getSettings();
    //         if (this.stop
    //             || (this.aiResult.moves.length === 1)
    //             || (settings.timeout > 0 && elapsed >= settings.timeout * 1000)
    //             || (settings.confidence > 0 && this.aiResult.confidence >= settings.confidence)
    //             || (settings.iterations > 0 && this.iteration >= settings.iterations)) {
    //             // console.log('it/sec', this.iteration / time);
    //             let cell = this.board.cell(this.aiResult.moves[0].move);
    //             this.makeMove(cell.x, cell.y);
    //             this.stopTimer();
    //         }
    //     } catch (e) {
    //         console.error(e);
    //         this.stopTimer();
    //     }
    // }

    stopTimer() {
        // if (this.timer) {
        //     this.timer.stop();
        //     this.timer = undefined;
        //     $('#analyze > i').attr('class', 'fa fa-play');
        // }
    }

    format(value: number, digits: number) {
        return value.toFixed(digits);
    }

    refresh() {
        this.boardView.refresh();
        d3.select("#player > img").attr("src", "img/piece/" + PieceType.King + "" + this.board.player + ".svg");
    }

    restart() {
        this.stopTimer();
        // let game = $('#game').val();
        this.board.init();
        this.refresh();
    }


}

new App().init();