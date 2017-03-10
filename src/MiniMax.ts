import {Board, Player, Move} from "./Chess";

export class MiniMaxAI {
    private move: Move;
    private originalBoard: Board;
    private counter = 0;
    private depth: number;

    constructor(board: Board, depth: number) {
        this.originalBoard = board;
        this.depth = depth;
    }

    findMove() {
        // let move = this.miniMax(this.originalBoard, this.originalBoard.player, this.depth);
        let move = this.alphaBeta(this.originalBoard, this.originalBoard.player, this.depth, -Number.MAX_VALUE, Number.MAX_VALUE);
        console.log('evaluations #', this.counter, 'move', move);
        return move;
    }

    private miniMax(board: Board, player: Player, currentDepth: number) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            return {value: board.evaluate()};
        }

        let value = null;
        let selectedMove = null;
        successors.forEach(move => {
            let copy = board.clone();
            copy.makeMove(move);
            let mm = this.miniMax(copy, Board.nextPlayer(player), currentDepth - 1);
            if (selectedMove == null //initial value
                || (player == Player.White && mm.value > value)   //max
                || (player == Player.Black && mm.value < value)) { //min
                selectedMove = {
                    move: move,
                    value: mm.value
                };
                value = mm.value;
            }
        });

        return selectedMove;
    }

    alphaBeta(board: Board, player: number, currentDepth: number, a: number, b: number) {
        let successors = board.getMoves();
        if (currentDepth == 0 || successors.length == 0) {
            this.counter++;
            return {value: board.evaluate()};
        }

        let value: number = null;
        let selectedMove = null;

        for (let i = 0; i < successors.length; i++) {
            let move = successors[i];
            let copy = board.clone();
            copy.makeMove(move);
            let mm = this.alphaBeta(copy, Board.nextPlayer(player), currentDepth - 1, a, b);
            if (player == 1) {
                if (value == null || mm.value > value) {
                    value = mm.value;
                    selectedMove = {
                        move: move,
                        value: value
                    };
                }
                a = Math.max(a, value);
                if (b <= a) {
                    break;
                }
            } else {
                if (value == null || mm.value < value) {
                    value = mm.value;
                    selectedMove = {
                        move: move,
                        value: value
                    };
                }
                b = Math.min(b, value);
                if (b <= a) {
                    break;
                }
            }
        }
        return selectedMove;
    }

}