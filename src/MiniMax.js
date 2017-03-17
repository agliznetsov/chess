import * as _ from 'lodash';
import * as Chess from './Chess';

export class MiniMaxAI {

    findMove(board, depth, ab) {
        this.counter = 0;
        let start = new Date().getTime();
        let value;
        if (ab) {
            value = this.alphaBeta(board, board.player, depth, -Number.MAX_VALUE, Number.MAX_VALUE);
        } else {
            value = this.miniMax(board, board.player, depth);
        }

        let res = {
            iterations: this.counter,
            time: (new Date().getTime() - start) / 1000,
            value: value
        };

        //Take a random move from all the moves with the best value
        let moves = board.getMoves();
        res.moves = _.filter(moves, it => it.evaluation === res.value);
        let index = Math.floor(Math.random() * res.moves.length);
        res.move = res.moves[index];
        return res;
    }

    miniMax(board, player, currentDepth) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            let res = board.evaluate();
            if (Math.abs(res) == Chess.WIN) {
                //If we can win, increase the value of the moves that lead to a win in less moves
                res += Math.sign(res) * currentDepth * 10;
            }
            return res;
        }

        let value = null;
        successors.forEach(move => {
            let copy = board.clone();
            copy.makeMove(move);
            move.evaluation = this.miniMax(copy, Chess.Board.nextPlayer(player), currentDepth - 1);
            if (value == null
                || (player == Chess.White && move.evaluation > value)
                || (player == Chess.Black && move.evaluation < value)) {
                value = move.evaluation;
            }
        });
        return value;
    }

    alphaBeta(board, player, currentDepth, a, b) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            let res = board.evaluate();
            if (Math.abs(res) == Chess.WIN) {
                //If we can win, increase the value of the moves that lead to a win in less moves
                res += Math.sign(res) * currentDepth * 10;
            }
            return res;
        }

        let value = null;
        for (let i = 0; i < successors.length; i++) {
            let move = successors[i];
            let copy = board.clone();
            copy.makeMove(move);
            move.evaluation = this.alphaBeta(copy, Chess.Board.nextPlayer(player), currentDepth - 1, a, b);
            if (player == Chess.White) {
                if (value == null || move.evaluation > value) {
                    value = move.evaluation;
                }
                a = Math.max(a, value);
                if (b < a) {
                    break;
                }
            } else {
                if (value == null || move.evaluation < value) {
                    value = move.evaluation;
                }
                b = Math.min(b, value);
                if (b < a) {
                    break;
                }
            }
        }
        return value;
    }

}


onmessage = function(e) {
    let board = Chess.Board.fromString(e.data);
    let ai = new MiniMaxAI();
    let res = ai.findMove(board, 3, true);
    console.log(res);
    res.move = res.move.toString();
    postMessage(JSON.stringify(res));
    close();
};
