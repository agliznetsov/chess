import * as assert from "assert";
import * as Chess from "../src/Chess";
import {Board, Piece, Cell} from "../src/Chess";
import {MiniMaxAI} from "../src/MiniMax";

describe('ConnectFourBoard', () => {

    it('minimax1', () => {
        for (let i = 0; i < 10; i++) {
            let board = new Board();
            board.add(new Piece(Chess.King, Chess.White, new Cell(7, 7)));
            board.add(new Piece(Chess.King, Chess.Black, new Cell(0, 0)));
            board.add(new Piece(Chess.Rook, Chess.White, new Cell(6, 1)));
            board.add(new Piece(Chess.Rook, Chess.White, new Cell(5, 7)));
            board.analyze();
            let res = new MiniMaxAI().findMove(board, 3, true);
            assert.equal(res.move.toString(), "5,7-5,0");
            assert.ok(res.value >= Chess.WIN);
        }
    });

    it('minimax1_black', () => {
        for (let i = 0; i < 10; i++) {
            let board = new Board();
            board.player = Chess.Black;
            board.add(new Piece(Chess.King, Chess.Black, new Cell(7, 7)));
            board.add(new Piece(Chess.King, Chess.White, new Cell(0, 0)));
            board.add(new Piece(Chess.Rook, Chess.Black, new Cell(6, 1)));
            board.add(new Piece(Chess.Rook, Chess.Black, new Cell(5, 7)));
            board.analyze();
            let move = new MiniMaxAI().findMove(board, 3, true);
            assert.equal(move.move.toString(), "5,7-5,0");
            assert.ok(move.value <= Chess.WIN);
        }
    });

    it('minimax2', () => {
        for (let i = 0; i < 10; i++) {
            let board = new Board();
            board.add(new Piece(Chess.King, Chess.White, new Cell(7, 7)));
            board.add(new Piece(Chess.King, Chess.Black, new Cell(0, 0)));
            board.add(new Piece(Chess.Rook, Chess.White, new Cell(6, 7)));
            board.add(new Piece(Chess.Rook, Chess.White, new Cell(5, 7)));
            board.analyze();
            let move = new MiniMaxAI().findMove(board, 3, true);
            assert.ok(move.value >= Chess.WIN);
            assert.ok(move.move.toString() == "6,7-6,1" || move.move.toString() == "5,7-5,1");
        }
    });

    it('minimax2_black', () => {
        for (let i = 0; i < 10; i++) {
            let board = new Board();
            board.player = Chess.Black;
            board.add(new Piece(Chess.King, Chess.Black, new Cell(7, 7)));
            board.add(new Piece(Chess.King, Chess.White, new Cell(0, 0)));
            board.add(new Piece(Chess.Rook, Chess.Black, new Cell(6, 7)));
            board.add(new Piece(Chess.Rook, Chess.Black, new Cell(5, 7)));
            board.analyze();
            let move = new MiniMaxAI().findMove(board, 3, true);
            assert.ok(move.value <= Chess.WIN);
            assert.ok(move.move.toString() == "6,7-6,1" || move.move.toString() == "5,7-5,1");
        }
    });

    it('minimax3', () => {
        let board = new Board();
        board.player = Chess.White;
        board.add(new Piece(Chess.King, Chess.White, new Cell(7, 7)));
        board.add(new Piece(Chess.Rook, Chess.White, new Cell(5, 7)));
        board.add(new Piece(Chess.King, Chess.Black, new Cell(4, 4)));
        board.analyze();

        let testBoard = new TestBoard();
        testBoard.player = Chess.White;
        testBoard.initChessNode(board, testBoard.node, 2);
        let minimax = new MiniMaxAI().findMove(testBoard, 2, false);
        testBoard.print(2);


        let testBoard2 = new TestBoard();
        testBoard2.player = Chess.White;
        testBoard2.initChessNode(board, testBoard2.node, 2);
        let ab = new MiniMaxAI().findMove(testBoard2, 2, true);
        testBoard2.print(2);

        assert.equal(ab.moves.length, minimax.moves.length);
    });


    it('minimax vs alphabeta', () => {
        let board = new TestBoard();
        board.init(3);
        // board.print(3);
        compareAi(board, Chess.White);
        compareAi(board, Chess.Black);
    });

    function compareAi(board, player) {
        let ai = new MiniMaxAI();
        board.player = player;
        let mm = ai.findMove(board, 3, false);
        let ab = ai.findMove(board, 3, true);
        console.log('player', player, 'value', mm.value, 'count', mm.moves.length, 'iterations', mm.iterations);
        console.log('player', player, 'value', ab.value, 'count', ab.moves.length, 'iterations', ab.iterations);
        assert.equal(mm.value, ab.value);
        assert.equal(mm.moves.length, ab.moves.length);
    }

});

class TestBoard {
    constructor() {
        this.node = {};
        this.node.depth = 0;
    }

    initChessNode(board, node, maxDepth) {
        if (node.depth == maxDepth) {
            node.value = board.evaluate();
        } else {
            let moves = board.getMoves();
            node.children = [];
            for (let i = 0; i < moves.length; i++) {
                let child = {};
                child.index = i;
                child.move = moves[i];
                child.depth = node.depth + 1;
                node.children.push(child);

                let copy = board.clone();
                copy.makeMove(moves[i]);
                this.initChessNode(copy, child, maxDepth);
            }
        }
    }

    init(depth) {
        this.value = 0;
        for (let i = 0; i <= depth; i++) {
            this.initNode(this.node, i);
        }
    }

    initNode(node, depth) {
        if (node.depth == depth) {
            node.value = Math.floor(Math.random() * 10);
            node.children = [];
            for (let i = 0; i < 30; i++) {
                let child = {};
                child.index = i;
                child.depth = depth + 1;
                node.children.push(child);
            }
        } else {
            for (let i = 0; i < node.children.length; i++) {
                this.initNode(node.children[i], depth);
            }
        }
    }

    print(depth) {
        for (let i = 0; i <= depth; i++) {
            let res = this.printNode(this.node, i);
            console.log(res);
        }
    }

    printNode(node, depth) {
        if (node.depth == depth) {
            return node.evaluation >=0 ? node.evaluation : '?';
        } else {
            let res = "|";
            for (let i = 0; i < node.children.length; i++) {
                res += " " + this.printNode(node.children[i], depth);
            }
            return res;
        }
    }

    getMoves() {
        return this.node.children;
    }

    evaluate() {
        return this.node.value;
    }

    clone() {
        let copy = new TestBoard();
        copy.player = this.player;
        copy.node = this.node;
        return copy;
    }

    makeMove(move) {
        this.node = move;
    }
}
