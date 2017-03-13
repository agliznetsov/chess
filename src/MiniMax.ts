import {Board, Player, Move} from "./Chess";

export class MiniMaxAI {
    private move: Move;
    private originalBoard: Board;
    private counter = 0;
    private depth: number;

    constructor(board: Board) {
        this.originalBoard = board;
        this.depth = 3;
    }

    findMove() {
        //let move = this.miniMax(this.originalBoard, this.originalBoard.player, this.depth);
        let move = this.alphaBeta(this.originalBoard, this.originalBoard.player, this.depth, -Number.MAX_VALUE, Number.MAX_VALUE);
        console.log('evaluations #', this.counter, 'move', move);
        move.iterations = this.counter;
        return move;
    }

    private miniMax(board: Board, player: Player, currentDepth: number) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            let res = {value: board.evaluate()};
            if (res.value > 1000) {
                //If we can win, increase the value of the moves that lead to a win in less moves
                res.value += currentDepth;
            }
            return res;
        }

        let value = null;
        let bestMoves: Array<any> = null;
        successors.forEach(move => {
            let copy = board.clone();
            copy.makeMove(move);
            let mm = this.miniMax(copy, Board.nextPlayer(player), currentDepth - 1);
            if (bestMoves == null //initial value
                || (player == Player.White && mm.value >= value)   //max
                || (player == Player.Black && mm.value <= value)) { //min
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

    alphaBeta(board: Board, player: number, currentDepth: number, a: number, b: number) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            let res = {value: board.evaluate()};
            if (res.value > 1000) {
                //If we can win, increase the value of the moves that lead to a win in less moves
                res.value += currentDepth;
            }
            return res;
        }

        let value: number = null;
        let bestMoves: Array<any> = null;

        for (let i = 0; i < successors.length; i++) {
            let move = successors[i];
            let copy = board.clone();
            copy.makeMove(move);
            let mm = this.alphaBeta(copy, Board.nextPlayer(player), currentDepth - 1, a, b);
            if (player == 1) {
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