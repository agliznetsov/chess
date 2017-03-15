
import * as assert from 'assert';

import * as Chess from '../src/Chess';
import {Board, Piece, Cell, Move} from '../src/Chess';
import {MiniMaxAI} from '../src/MiniMax';

describe('ConnectFourBoard', () => {

    it('minimax1', () => {
        for (let i = 0; i < 10; i++) {
            let board = new Board();
            board.add(new Piece(Chess.King, Chess.White, new Cell(7, 7)));
            board.add(new Piece(Chess.King, Chess.Black, new Cell(0, 0)));
            board.add(new Piece(Chess.Rook, Chess.White, new Cell(6, 1)));
            board.add(new Piece(Chess.Rook, Chess.White, new Cell(5, 7)));
            board.analyze();
            let ai = new MiniMaxAI(board);
            let move = ai.findMove();
            assert.equal(move.move.toString(), "5,7-5,0");
            assert.ok(move.value > 1000);
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
            let ai = new MiniMaxAI(board);
            let move = ai.findMove();
            assert.equal(move.move.toString(), "5,7-5,0");
            assert.ok(move.value < 1000);
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
            let ai = new MiniMaxAI(board);
            let move = ai.findMove();
            assert.ok(move.value > 1000);
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
            let ai = new MiniMaxAI(board);
            let move = ai.findMove();
            assert.ok(move.value < 1000);
            assert.ok(move.move.toString() == "6,7-6,1" || move.move.toString() == "5,7-5,1");
        }
    });

});