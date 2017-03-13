/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as assert from 'assert';

import {Board, Player, King, Rook, Cell, GameStatus, Queen, Pawn, Move, PieceType} from '../src/Chess';
import {MiniMaxAI} from "../src/MiniMax";

describe('ConnectFourBoard', () => {

    it('minimax1', () => {
        for (let i = 0; i < 10; i++) {
            let board = new Board();
            board.add(new King(Player.Black, new Cell(0, 0)));
            board.add(new King(Player.White, new Cell(7, 7)));
            board.add(new Rook(Player.White, new Cell(6, 1)));
            board.add(new Rook(Player.White, new Cell(5, 7)));
            board.analyze();
            let ai = new MiniMaxAI(board);
            let move = ai.findMove();
            assert.equal(move.move.toString(), "5,7-5,0");
            assert.ok(move.value > 100);
        }
    });

    it('minimax2', () => {
        for (let i = 0; i < 10; i++) {
            let board = new Board();
            board.add(new King(Player.Black, new Cell(0, 0)));
            board.add(new King(Player.White, new Cell(7, 7)));
            board.add(new Rook(Player.White, new Cell(6, 7)));
            board.add(new Rook(Player.White, new Cell(5, 7)));
            board.analyze();
            let ai = new MiniMaxAI(board);
            let move = ai.findMove();
            assert.ok(move.value > 100);
            assert.ok(move.move.toString() == "6,7-6,1" || move.move.toString() == "5,7-5,1");
        }
    });

});