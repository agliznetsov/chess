import * as _ from 'lodash';

export const Pawn = 1;
export const Knight = 2;
export const Bishop = 3;
export const Rook = 4;
export const Queen = 5;
export const King = 6;

export const WIN = 1000000;
export const SIZE = 8;

export const White = 1;
export const Black = 2;

export const Checkmate = 1;
export const Stalemate = 2;


export class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    id() {
        return Cell.ID(this.x, this.y);
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }

    toString() {
        return this.x + "," + this.y;
    }

    static fromString(str) {
        let arr = str.split(",");
        return new Cell(Number(arr[0]), Number(arr[1]));
    }

    static ID(x, y) {
        return y * SIZE + x;
    }

    static OK(x, y) {
        return (x >= 0 && x < 8 && y >= 0 && y < 8);
    }
}

export class Move {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    toString() {
        return this.from + "-" + this.to;
    }

    static fromString(str) {
        let arr = str.split("-");
        return new Move(Cell.fromString(arr[0]), Cell.fromString(arr[1]));
    }
}

let _counter = 0;

let _values = {
    1: 1,
    2: 3,
    3: 3,
    4: 5,
    5: 9,
    6: 0
};

export class Piece {

    constructor(type, player, cell) {
        this.id = ++_counter;
        this.type = type;
        this.player = player;
        this.cell = cell;
        this.moves = [];
    }

    toString() {
        return this.id + ";" + this.type + ";" + this.player + ";" + this.cell;
    }

    static fromString(str) {
        let arr = str.split(";");
        let piece = new Piece();
        piece.id = Number(arr[0]);
        piece.type = Number(arr[1]);
        piece.player = Number(arr[2]);
        piece.cell = Cell.fromString(arr[3]);
        return piece;
    }

    clone() {
        let p = new Piece(this.type, this.player, this.cell);
        p.moves = this.moves.slice();
        p.checked = this.checked;
        return p;
    };

    value() {
        return _values[this.type];
    };

    addMoves(x, y) {
        switch (this.type) {
            case 1:
                this._addPawnMoves(x, y);
                break;
            case 2:
                this._addKnightMoves(x, y);
                break;
            case 3:
                this._addBishopMoves(x, y);
                break;
            case 4:
                this._addRookMoves(x, y);
                break;
            case 5:
                this._addQueenMoves(x, y);
                break;
            case 6:
                this._addKingMoves(x, y);
                break;
        }
    };

    _addPawnMoves(x, y) {
        if (this.player == White) {
            this.addMove(x, y - 1, true, false);
            if (y == 6 && !this.board.get(x, 5)) {
                this.addMove(x, 4, true, false);
            }
            this.addMove(x - 1, y - 1, false, true);
            this.addMove(x + 1, y - 1, false, true);
        } else {
            this.addMove(x, y + 1, true, false);
            if (y == 1 && !this.board.get(x, 2)) {
                this.addMove(x, 3, true, false);
            }
            this.addMove(x - 1, y + 1, false, true);
            this.addMove(x + 1, y + 1, false, true);
        }
    }

    _addKnightMoves(x, y) {
        this.addMove(x + 1, y - 2);
        this.addMove(x + 2, y - 1);
        this.addMove(x + 1, y + 2);
        this.addMove(x + 2, y + 1);
        this.addMove(x - 1, y + 2);
        this.addMove(x - 2, y + 1);
        this.addMove(x - 1, y - 2);
        this.addMove(x - 2, y - 1);
    }

    _addBishopMoves(x, y) {
        this.addLine(x, y, -1, -1);
        this.addLine(x, y, -1, 1);
        this.addLine(x, y, 1, -1);
        this.addLine(x, y, 1, 1);
    }

    _addRookMoves(x, y) {
        this.addLine(x, y, -1, 0);
        this.addLine(x, y, 1, 0);
        this.addLine(x, y, 0, -1);
        this.addLine(x, y, 0, 1);
    }

    _addQueenMoves(x, y) {
        this.addLine(x, y, -1, -1);
        this.addLine(x, y, -1, 1);
        this.addLine(x, y, 1, -1);
        this.addLine(x, y, 1, 1);
        this.addLine(x, y, -1, 0);
        this.addLine(x, y, 1, 0);
        this.addLine(x, y, 0, -1);
        this.addLine(x, y, 0, 1);
    }

    _addKingMoves(x, y) {
        let king = this.board.getKing(Board.nextPlayer(this.player));
        let forbidden = {};

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx !== 0 || dy !== 0) {
                    forbidden[Cell.ID(king.cell.x + dx, king.cell.y + dy)] = true;
                }
            }
        }

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx !== 0 || dy !== 0) {
                    if (!forbidden[Cell.ID(x + dx, y + dy)]) {
                        this.addMove(x + dx, y + dy);
                    }
                }
            }
        }
    }

    findMoves() {
        this.moves = [];
        this.addMoves(this.cell.x, this.cell.y);
    }

    addLine(x, y, dx, dy) {
        while (true) {
            x += dx;
            y += dy;
            if (!Cell.OK(x, y)) {
                break;
            }
            let p = this.board.get(x, y);
            if (!p) {
                this.moves.push(new Cell(x, y));
            } else {
                if (p.player != this.player) {
                    this.doAddMove(x, y, p);
                }
                break;
            }
        }
    }

    addMove(x, y, move = true, capture = true) {
        if (Cell.OK(x, y)) {
            let p = this.board.get(x, y);
            if ((!p && move) || (p && p.player != this.player && capture)) {
                this.doAddMove(x, y, p);
            }
        }
    }

    doAddMove(x, y, p) {
        this.moves.push(new Cell(x, y));
        if (p && p.type == King) {
            p.checked = true;
        }
    }

    isValidMove(cell) {
        return _.find(this.moves, it => it.equals(cell));
    }
}


export class Board {

    constructor() {
        this.cells = new Array(SIZE * SIZE);
        this.kings = new Array(2);
        this.pieces = [];
        this.selection = new Array(SIZE * SIZE);
        this.history = [];
        this.player = White;
        this.movesCounter = {};
    }

    init() {
        this.cells = new Array(SIZE * SIZE);
        this.selection = new Array(SIZE * SIZE);
        this.pieces = [];
        this.player = White;
        this.initRow(0, Black, "42356324");
        this.initRow(1, Black, "11111111");
        this.initRow(6, White, "11111111");
        this.initRow(7, White, "42356324");
        this.analyze();
    }

    toString() {
        let str = this.player + " ";
        this.pieces.forEach(p => {
            str += p.toString() + " ";
        });
        return str;
    }

    static fromString(str) {
        let arr = str.split(" ");
        let board = new Board();
        board.player = Number(arr[0]);
        for (let i = 1; i < arr.length; i++) {
            if (arr[i].length) {
                let p = Piece.fromString(arr[i]);
                board.add(p);
            }
        }
        board.analyze();
        return board;
    }

    initRow(y, player, row) {
        for (let x = 0; x < row.length; x++) {
            let type = Number(row.charAt(x));
            if (type >= 0) {
                let piece = new Piece(type, player, new Cell(x, y));
                this.add(piece);
            }
        }
    }

    clone() {
        let clone = new Board();
        clone.player = this.player;
        clone.cells = new Array(SIZE * SIZE);
        clone.pieces = [];
        this.pieces.forEach(p => {
            clone.add(p.clone());
        });
        return clone;
    }

    getPieces() {
        return this.pieces;
    }

    add(piece) {
        piece.board = this;
        this.cells[piece.cell.id()] = piece;
        this.pieces.push(piece);
        if (piece.type == King) {
            this.kings[piece.player - 1] = piece;
        }
    }

    remove(piece) {
        piece.board = null;
        this.cells[piece.cell.id()] = null;
        _.remove(this.pieces, it => it.cell.equals(piece.cell));
    }

    getCell(cell) {
        return this.cells[cell.id()];
    }

    get(x, y) {
        return this.cells[Cell.ID(x, y)];
    }

    getKing(player) {
        return this.kings[player - 1];
    }

    makeMove(move) {
        this.doMove(move);
        this.player = Board.nextPlayer(this.player);
        this.analyze();
    }

    doMove(move) {
        let source = this.getCell(move.from);
        let target = this.getCell(move.to);
        if (target) {
            this.remove(target);
        }
        source.cell = move.to;
        this.cells[move.from.id()] = null;
        this.cells[move.to.id()] = source;
        let historyItem = {
            move: move,
            source: source,
            target: target
        };
        if (source.type == Pawn && ((source.player == White && move.to.y === 0) || (source.player == Black && move.to.y === 7))) {
            historyItem.promote = true;
            this.remove(source);
            historyItem.source = new Piece(Queen, source.player, source.cell);
            this.add(historyItem.source);
        }
        this.history.push(historyItem);
    }

    undo() {
        if (this.history.length) {
            this.undoMove();
            this.player = Board.nextPlayer(this.player);
            this.analyze();
        }
    }

    undoMove() {
        let move = this.history.pop();
        if (move.target) {
            this.add(move.target);
        } else {
            this.cells[move.move.to.id()] = null;
        }
        move.source.cell = move.move.from;
        this.cells[move.move.from.id()] = move.source;
        if (move.promote) {
            this.remove(move.source);
            this.add(new Piece(Pawn, move.source.player, move.move.from));
        }
    }

    analyze() {
        this.status = null;
        this.findMoves();
        this.status = this.checkMoves();
    }

    checkMoves() {
        //1. try all moves
        let moveCount = 0;
        this.pieces.forEach(piece => {
            if (piece.player == this.player) {
                let validMoves = [];
                piece.moves.forEach(move => {
                    let copy = this.clone();
                    copy.doMove(new Move(piece.cell, move));
                    //2. find opponent moves
                    copy.findMoves();
                    //3. exclude checked moves
                    if (!copy.getKing(this.player).checked) {
                        validMoves.push(move);
                    }
                });
                piece.moves = validMoves;
                moveCount += validMoves.length;
            }
        });
        this.movesCounter[this.player] = moveCount;
        //4. if no moves or no pieces -> end game
        if (moveCount === 0) {
            return this.getKing(this.player).checked ? Checkmate : Stalemate;
        } else {
            return (this.pieces.length == 2) ? Stalemate : null;
        }
    }

    findMoves() {
        //TODO: castling
        this.moves = null;
        this.movesCounter[White] = 0;
        this.movesCounter[Black] = 0;
        this.kings.forEach(k => k.checked = false);
        this.pieces.forEach(p => {
            p.findMoves();
            //TODO: use opponent moves to build attacked cells and restrict legal moves ?
            this.movesCounter[p.player] += p.moves.length;
        });
    }

    getMoves() {
        if (!this.moves) {
            this.moves = [];
            this.pieces.forEach(p => {
                if (p.player == this.player) {
                    p.moves.forEach(c => this.moves.push(new Move(p.cell, c)));
                }
            });
        }
        return this.moves;
    }

    evaluate() {
        if (this.status) {
            if (this.status == Checkmate) {
                return this.player == White ? -WIN : WIN;
            } else
                return 0;
        } else {
            let value = 0; //0.05 * (this.movesCounter[White] - this.movesCounter[Black]);
            this.pieces.forEach(p => value += ((p.player == White) ? p.value() : -p.value()));
            return value;
        }
    }

    clearSelection() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i] = false;
        }
    }

    setSelection(cell, value) {
        this.selection[cell.id()] = value;
    }

    getSelection(cell) {
        return this.selection[cell.id()];
    }

    static nextPlayer(player) {
        return player == White ? Black : White;
    }
}

