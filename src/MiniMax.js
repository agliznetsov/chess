import * as Chess from './Chess';
import {Board, Piece, Cell, Move} from './Chess';

export class MiniMaxAI {

    constructor(board) {
        this.originalBoard = board;
        this.depth = 3;
        this.counter = 0;
    }

    findMove() {
        let start = new Date().getTime();
        //let move = this.miniMax(this.originalBoard, this.originalBoard.player, this.depth);
        let move = this.alphaBeta(this.originalBoard, this.originalBoard.player, this.depth, -Number.MAX_VALUE, Number.MAX_VALUE);
        let time = (new Date().getTime() - start) / 1000;
        move.iterations = this.counter;
        move.time = time;
        console.log('move', move);
        return move;
    }

    miniMax(board, player, currentDepth) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            let res = {value: board.evaluate()};
            if (Math.abs(res.value) > 1000) {
                //If we can win, increase the value of the moves that lead to a win in less moves
                res.value += Math.sign(res.value) * currentDepth;
            }
            return res;
        }

        let value = null;
        let bestMoves = null;
        successors.forEach(move => {
            let copy = board.clone();
            copy.makeMove(move);
            let mm = this.miniMax(copy, Board.nextPlayer(player), currentDepth - 1);
            if (bestMoves == null //initial value
                || (player == Chess.White && mm.value >= value)   //max
                || (player == Chess.Black && mm.value <= value)) { //min
                let selectedMove = {
                    move: move,
                    value: mm.value
                };
                if (bestMoves == null || mm.value !== value) {
                    bestMoves = [];
                }
                bestMoves.push(selectedMove);
                value = mm.value;
            }
        });

        //Take a random move from all the moves with the best value
        let index = Math.floor(Math.random() * bestMoves.length);
        return bestMoves[index];
    }

    alphaBeta(board, player, currentDepth, a, b) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            let res = {value: board.evaluate()};
            if (Math.abs(res.value) > 1000) {
                //If we can win, increase the value of the moves that lead to a win in less moves
                res.value += Math.sign(res.value) * currentDepth;
            }
            return res;
        }

        let value = null;
        let bestMoves = null;

        for (let i = 0; i < successors.length; i++) {
            let move = successors[i];
            let copy = board.clone();
            copy.makeMove(move);
            let mm = this.alphaBeta(copy, Board.nextPlayer(player), currentDepth - 1, a, b);
            if (player == Chess.White) {
                if (value == null || mm.value >= value) {
                    let selectedMove = {
                        move: move,
                        value: mm.value
                    };
                    if (bestMoves == null || mm.value > value) {
                        bestMoves = [];
                    }
                    bestMoves.push(selectedMove);
                    value = mm.value;
                }
                a = Math.max(a, value);
                if (b <= a) {
                    break;
                }
            } else {
                if (value == null || mm.value <= value) {
                    let selectedMove = {
                        move: move,
                        value: mm.value
                    };
                    if (bestMoves == null || mm.value < value) {
                        bestMoves = [];
                    }
                    bestMoves.push(selectedMove);
                    value = mm.value;
                }
                b = Math.min(b, value);
                if (b <= a) {
                    break;
                }
            }
        }

        //Take a random move from all the moves with the best value
        let index = Math.floor(Math.random() * bestMoves.length);
        return bestMoves[index];
    }

}


onmessage = function(e) {
    let board = Board.fromString(e.data);
    let ai = new MiniMaxAI(board);
    let move = ai.findMove();
    move.move = move.move.toString();
    postMessage(JSON.stringify(move));
    close();
};
