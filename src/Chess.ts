import * as _ from 'lodash';

export class Cell {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    id(): number {
        return Cell.ID(this.x, this.y);
    }

    equals(other: Cell): boolean {
        return this.x === other.x && this.y === other.y;
    }

    static ID(x: number, y: number): number {
        return y * Board.SIZE + x;
    }

    static OK(x: number, y: number): boolean {
        return (x >= 0 && x < 8 && y >= 0 && y < 8);
    }

    // static getX(id: number): number {
    //     return id % Board.SIZE;
    // }
    //
    // static getY(id: number): number {
    //     return Math.ceil(id / Board.SIZE);
    // }
}

export class Move {
    readonly from: Cell;
    readonly to: Cell;

    constructor(from: Cell, to: Cell) {
        this.from = from;
        this.to = to;
    }
}

export const enum PieceType {
    Pawn = 1, Knight = 2, Bishop = 3, Rook = 4, Queen = 5, King = 6
}

export const enum Player {
    White = 1, Black = 2
}

export abstract class Piece {
    private static counter = 0;

    readonly id: number;
    readonly type: PieceType;
    readonly player: Player;
    cell: Cell;
    board: Board;
    moves: Cell[] = [];

    constructor(type: PieceType, player: Player, cell: Cell) {
        this.id = ++Piece.counter;
        this.type = type;
        this.player = player;
        this.cell = cell;
    }

    findMoves() {
        this.moves = [];
        this.addMoves(this.cell.x, this.cell.y);
    }

    protected abstract addMoves(x: number, y: number);

    protected addLine(x: number, y: number, dx: number, dy: number) {
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
                    this.moves.push(new Cell(x, y));
                    break;
                } else {
                    break;
                }
            }
        }
    }

    protected addMove(x: number, y: number, move: boolean = true, capture: boolean = true) {
        if (Cell.OK(x, y)) {
            let p = this.board.get(x, y);
            if ((!p && move) || (p && p.player != this.player && capture)) {
                this.moves.push(new Cell(x, y));
            }
        }
    }

    static create(type: number, player: Player, cell: Cell): Piece {
        switch (type) {
            case 1:
                return new Pawn(player, cell);
            case 2:
                return new Knight(player, cell);
            case 3:
                return new Bishop(player, cell);
            case 4:
                return new Rook(player, cell);
            case 5:
                return new Queen(player, cell);
            case 6:
                return new King(player, cell);
        }
    }

    isValidMove(cell: Cell) {
        return _.find(this.moves, it => it.equals(cell));
    }
}

class Pawn extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Pawn, player, cell);
    }

    protected addMoves(x: number, y: number) {
        if (this.player == Player.White) {
            this.addMove(x, y - 1, true, false);
            if (y == 6) {
                this.addMove(x, 4, true, false);
            }
            this.addMove(x - 1, y - 1, false, true);
            this.addMove(x + 1, y - 1, false, true);
        } else {
            this.addMove(x, y + 1, true, false);
            if (y == 1) {
                this.addMove(x, 3, true, false);
            }
            this.addMove(x - 1, y + 1, false, true);
            this.addMove(x + 1, y + 1, false, true);
        }
    }
}

class Knight extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Knight, player, cell);
    }

    protected addMoves(x: number, y: number) {
        this.addMove(x + 1, y - 2);
        this.addMove(x + 2, y - 1);
        this.addMove(x + 1, y + 2);
        this.addMove(x + 2, y + 1);
        this.addMove(x - 1, y + 2);
        this.addMove(x - 2, y + 1);
        this.addMove(x - 1, y - 2);
        this.addMove(x - 2, y - 1);
    }
}

class Bishop extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Bishop, player, cell);
    }

    protected addMoves(x: number, y: number) {
        this.addLine(x, y, -1, -1);
        this.addLine(x, y, -1, 1);
        this.addLine(x, y, 1, -1);
        this.addLine(x, y, 1, 1);
    }
}

class Rook extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Rook, player, cell);
    }

    protected addMoves(x: number, y: number) {
        this.addLine(x, y, -1, 0);
        this.addLine(x, y, 1, 0);
        this.addLine(x, y, 0, -1);
        this.addLine(x, y, 0, 1);
    }
}

class Queen extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Queen, player, cell);
    }

    protected addMoves(x: number, y: number) {
        this.addLine(x, y, -1, -1);
        this.addLine(x, y, -1, 1);
        this.addLine(x, y, 1, -1);
        this.addLine(x, y, 1, 1);
        this.addLine(x, y, -1, 0);
        this.addLine(x, y, 1, 0);
        this.addLine(x, y, 0, -1);
        this.addLine(x, y, 0, 1);
    }
}

class King extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.King, player, cell);
    }

    protected addMoves(x: number, y: number) {
        let king = this.board.getKing(Board.nextPlayer(this.player));
        let forbidden = {};

        for(let dy = -1; dy <= 1; dy++) {
            for(let dx = -1; dx <= 1; dx++) {
                if (dx !== 0 || dy !== 0) {
                    forbidden[Cell.ID(king.cell.x + dx, king.cell.y + dy)] = true;
                }
            }
        }

        for(let dy = -1; dy <= 1; dy++) {
            for(let dx = -1; dx <= 1; dx++) {
                if (dx !== 0 || dy !== 0) {
                    if (!forbidden[Cell.ID(x + dx, y + dy)]) {
                        this.addMove(x + dx, y + dy);
                    }
                }
            }
        }
    }
}

export class Board {
    static readonly SIZE: number = 8;

    private cells: Piece[];
    private kings: Piece[] = new Array(2);
    private pieces: Piece[];
    private selection: any[];
    private history: Move[] = [];
    player: Player;


    constructor() {
        this.init();
    }

    getPieces(): Piece[] {
        return this.pieces;
    }

    init() {
        this.cells = new Array(Board.SIZE * Board.SIZE);
        this.selection = new Array(Board.SIZE * Board.SIZE);
        this.pieces = [];
        this.player = Player.White;
        this.initRow(0, Player.Black, "42356324");
        this.initRow(1, Player.Black, "11111111");
        this.initRow(6, Player.White, "11111111");
        this.initRow(7, Player.White, "42356324");
        this.analyze();
    }

    private initRow(y: number, player: Player, row: string) {
        for (let x = 0; x < row.length; x++) {
            let type = Number(row.charAt(x));
            if (type >= 0) {
                let piece = Piece.create(type, player, new Cell(x, y));
                this.add(piece);
            }
        }
    }

    public add(piece: Piece) {
        piece.board = this;
        this.cells[piece.cell.id()] = piece;
        this.pieces.push(piece);
        if (piece.type == PieceType.King) {
            this.kings[piece.player - 1] = piece;
        }
    }

    public remove(piece: Piece) {
        piece.board = null;
        this.cells[piece.cell.id()] = null;
        _.remove(this.pieces, it => it.cell.equals(piece.cell));
    }

    public getCell(cell: Cell): Piece {
        return this.cells[cell.id()];
    }

    public get(x: number, y: number): Piece {
        return this.cells[Cell.ID(x, y)];
    }

    public getKing(player: Player): Piece {
        return this.kings[player - 1];
    }

    public analyze() {
        //TODO: check, chekmate, castling, promotion
        this.pieces.forEach(p => p.findMoves());
    }

    public clearSelection() {
        for (let i = 0; i < this.selection.length; i++) {
            this.selection[i] = false;
        }
    }

    public setSelection(cell: Cell, value) {
        this.selection[cell.id()] = value;
    }

    public getSelection(cell: Cell) {
        return this.selection[cell.id()];
    }

    public makeMove(move: Move) {
        let source = this.getCell(move.from);
        let target = this.getCell(move.to);
        if (target) {
            this.remove(target);
        }
        source.cell = move.to;
        this.cells[move.from.id()] = null;
        this.cells[move.to.id()] = source;
        this.analyze();
        this.history.push(move);
        this.player = Board.nextPlayer(this.player);
    }

    public static nextPlayer(player: Player) {
        return player == Player.White ? Player.Black : Player.White;
    }
}
