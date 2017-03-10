/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import * as assert from 'assert';

import {Board, Player, King, Rook, Cell, GameStatus, Queen, Pawn, Move, PieceType} from '../src/Chess';

describe('ConnectFourBoard', () => {

    it('checkmate', () => {
        let board = new Board();
        board.player = Player.Black;

        board.add(new King(Player.White, new Cell(7, 7)));
        board.add(new Rook(Player.White, new Cell(0, 0)));
        board.add(new Rook(Player.White, new Cell(1, 1)));
        board.add(new King(Player.Black, new Cell(7, 0)));
        board.analyze();

        assert.equal(GameStatus.Checkmate, board.status);
    });

    it('check', () => {
        let board = new Board();
        board.player = Player.Black;

        board.add(new King(Player.Black, new Cell(0, 0)));
        board.add(new Queen(Player.White, new Cell(1, 1)));
        board.add(new King(Player.White, new Cell(7, 7)));
        let res =  board.analyze();
        assert.equal(res, null);
        let king = board.getKing(Player.Black);
        assert.equal(1, king.moves.length);
        assert.equal(Cell.ID(1, 1), king.moves[0].id());
    });

    it('promote', () => {
        let board = new Board();
        board.add(new King(Player.Black, new Cell(0, 0)));
        board.add(new King(Player.White, new Cell(7, 7)));
        board.add(new Pawn(Player.White, new Cell(3, 1)));

        board.makeMove(new Move(new Cell(3, 1), new Cell(3, 0)));
        let p = board.get(3, 0);
        assert.equal(PieceType.Queen, p.type);
        assert.equal(Player.White, p.player);

        board.undo();
        assert.equal(null, board.get(3, 0));
        let p2 = board.get(3, 1);
        assert.equal(PieceType.Pawn, p2.type);
        assert.equal(Player.White, p2.player);
    });

    it('promote2', () => {
        let board = new Board();
        board.add(new King(Player.Black, new Cell(0, 0)));
        board.add(new Rook(Player.Black, new Cell(7, 0)));
        board.add(new King(Player.White, new Cell(7, 7)));
        board.add(new Pawn(Player.White, new Cell(6, 1)));

        board.makeMove(new Move(new Cell(6, 1), new Cell(7, 0)));
        let p = board.get(7, 0);
        assert.equal(PieceType.Queen, p.type);
        assert.equal(Player.White, p.player);
        assert.equal(3, board.getPieces().length);

        board.undo();
        assert.equal(4, board.getPieces().length);
        assert.equal(PieceType.Rook, board.get(7, 0).type);
        let p2 = board.get(6, 1);
        assert.equal(PieceType.Pawn, p2.type);
        assert.equal(Player.White, p2.player);
    });

});