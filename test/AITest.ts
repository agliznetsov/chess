/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as assert from 'assert';

import {Board, Player, King, Rook, Cell, GameStatus, Queen, Pawn, Move, PieceType} from '../src/Chess';
import {MiniMaxAI} from "../src/MiniMax";

describe('ConnectFourBoard', () => {

    it('minimax1', () => {
        let board = new Board();
        board.add(new King(Player.Black, new Cell(0, 0)));
        board.add(new King(Player.White, new Cell(7, 7)));
        board.add(new Rook(Player.White, new Cell(6, 1)));
        board.add(new Rook(Player.White, new Cell(5, 7)));
        board.analyze();
        let ai = new MiniMaxAI(board, 1);
        let move = ai.findMove();
        assert.equal("5,7-5,0", move.move.toString());
        assert.ok(move.value > 100);
    });

    it('minimax2', () => {
        let board = new Board();
        board.add(new King(Player.Black, new Cell(0, 0)));
        board.add(new King(Player.White, new Cell(7, 7)));
        board.add(new Rook(Player.White, new Cell(6, 7)));
        board.add(new Rook(Player.White, new Cell(5, 7)));
        board.analyze();
        let ai = new MiniMaxAI(board, 3);
        let move = ai.findMove();
        assert.ok(move.value > 100);
        assert.equal("6,7-6,1", move.move.toString());
    });

    it('minimax_start', () => {
        let board = new Board();
        board.init();
        board.analyze();
        let ai = new MiniMaxAI(board, 3);
        let move = ai.findMove();
    });

});