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

    public toString() : string {
        return this.x + "," + this.y;
    }

    static ID(x: number, y: number): number {
        return y * Board.SIZE + x;
    }

    static OK(x: number, y: number): boolean {
        return (x >= 0 && x < 8 && y >= 0 && y < 8);
    }
}

export class Move {
    readonly from: Cell;
    readonly to: Cell;

    constructor(from: Cell, to: Cell) {
        this.from = from;
        this.to = to;
    }

    public toString() : string {
        return this.from + "-" + this.to;
    }
}

export const enum PieceType {
    Pawn = 1, Knight = 2, Bishop = 3, Rook = 4, Queen = 5, King = 6
}

export const enum Player {
    White = 1, Black = 2
}

export const enum GameStatus {
    Checkmate = 1, Stalemate = 2
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

    public abstract clone(): Piece;

    public abstract value(): number;

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
                    this.doAddMove(x, y, p);
                }
                break;
            }
        }
    }

    protected addMove(x: number, y: number, move: boolean = true, capture: boolean = true) {
        if (Cell.OK(x, y)) {
            let p = this.board.get(x, y);
            if ((!p && move) || (p && p.player != this.player && capture)) {
                this.doAddMove(x, y, p);
            }
        }
    }

    private doAddMove(x: number, y: number, p: Piece) {
        this.moves.push(new Cell(x, y));
        if (p && p.type == PieceType.King) {
            (p as King).checked = true;
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

export class Pawn extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Pawn, player, cell);
    }

    public value() {
        return 1;
    }

    public clone(): Pawn {
        let p = new Pawn(this.player, this.cell);
        p.moves = this.moves.slice();
        return p;
    }

    protected addMoves(x: number, y: number) {
        if (this.player == Player.White) {
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
}

export class Knight extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Knight, player, cell);
    }

    public value() {
        return 3;
    }

    public clone(): Knight {
        let p = new Knight(this.player, this.cell);
        p.moves = this.moves.slice();
        return p;
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

export class Bishop extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Bishop, player, cell);
    }

    public value() {
        return 3;
    }

    public clone(): Bishop {
        let p = new Bishop(this.player, this.cell);
        p.moves = this.moves.slice();
        return p;
    }

    protected addMoves(x: number, y: number) {
        this.addLine(x, y, -1, -1);
        this.addLine(x, y, -1, 1);
        this.addLine(x, y, 1, -1);
        this.addLine(x, y, 1, 1);
    }
}

export class Rook extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Rook, player, cell);
    }

    public value() {
        return 5;
    }

    public clone(): Rook {
        let p = new Rook(this.player, this.cell);
        p.moves = this.moves.slice();
        return p;
    }

    protected addMoves(x: number, y: number) {
        this.addLine(x, y, -1, 0);
        this.addLine(x, y, 1, 0);
        this.addLine(x, y, 0, -1);
        this.addLine(x, y, 0, 1);
    }
}

export class Queen extends Piece {
    constructor(player: Player, cell: Cell) {
        super(PieceType.Queen, player, cell);
    }

    public value() {
        return 9;
    }

    public clone(): Queen {
        let p = new Queen(this.player, this.cell);
        p.moves = this.moves.slice();
        return p;
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

export class King extends Piece {
    checked: boolean;

    constructor(player: Player, cell: Cell) {
        super(PieceType.King, player, cell);
    }

    public value() {
        return 0;
    }

    public clone(): King {
        let p = new King(this.player, this.cell);
        p.moves = this.moves.slice();
        p.checked = this.checked;
        return p;
    }

    protected addMoves(x: number, y: number) {
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
}

export class Board {
    static readonly SIZE: number = 8;

    private cells: Piece[] = new Array(Board.SIZE * Board.SIZE);
    private kings: King[] = new Array(2);
    private pieces: Piece[] = [];
    private selection: any[] = new Array(Board.SIZE * Board.SIZE);
    private history: any[] = [];
    player: Player = Player.White;
    status: GameStatus;

    init() {
        this.cells = new Array(Board.SIZE * Board.SIZE);
        this.selection = new Array(Board.SIZE * Board.SIZE);
        this.pieces = [];
        this.player = Player.White;
        this.initRow(0, Player.Black, "42356324");
        this.initRow(1, Player.Black, "11111111");
        this.initRow(6, Player.White, "11111111");
        this.initRow(7, Player.White, "42356324");
        // this.add(new King(Player.Black, new Cell(0, 0)));
        // this.add(new King(Player.White, new Cell(7, 7)));
        // this.add(new Rook(Player.White, new Cell(6, 1)));
        // this.add(new Rook(Player.White, new Cell(5, 7)));
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

    public clone(): Board {
        let clone = new Board();
        clone.player = this.player;
        clone.cells = new Array(Board.SIZE * Board.SIZE);
        clone.pieces = [];
        this.pieces.forEach(p => {
            clone.add(p.clone());
        });
        return clone;
    }

    public getPieces(): Piece[] {
        return this.pieces;
    }

    public add(piece: Piece) {
        piece.board = this;
        this.cells[piece.cell.id()] = piece;
        this.pieces.push(piece);
        if (piece.type == PieceType.King) {
            this.kings[piece.player - 1] = piece as King;
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

    public getKing(player: Player): King {
        return this.kings[player - 1];
    }

    public makeMove(move: Move) {
        this.doMove(move);
        this.player = Board.nextPlayer(this.player);
        this.analyze();
    }

    public doMove(move: Move) {
        let source = this.getCell(move.from);
        let target = this.getCell(move.to);
        if (target) {
            this.remove(target);
        }
        source.cell = move.to;
        this.cells[move.from.id()] = null;
        this.cells[move.to.id()] = source;
        let historyItem: any = {
            move: move,
            source: source,
            target: target
        };
        if (source.type == PieceType.Pawn && ((source.player == Player.White && move.to.y === 0) || (source.player == Player.Black && move.to.y === 7))) {
            historyItem.promote = true;
            this.remove(source);
            historyItem.source = new Queen(source.player, source.cell);
            this.add(historyItem.source);
        }
        this.history.push(historyItem);
    }

    public undo() {
        if (this.history.length) {
            this.undoMove();
            this.player = Board.nextPlayer(this.player);
            this.analyze();
        }
    }

    private undoMove() {
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
            this.add(new Pawn(move.source.player, move.move.from));
        }
    }

    public analyze() {
        this.status = null;
        this.findMoves();
        this.status = this.checkMoves();
    }

    private checkMoves(): GameStatus {
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
        //4. if no moves or no pieces -> end game
        if (moveCount === 0) {
            return this.getKing(this.player).checked ? GameStatus.Checkmate : GameStatus.Stalemate;
        } else {
            return (this.pieces.length == 2) ? GameStatus.Stalemate : null;
        }
    }

    private findMoves() {
        //TODO: castling
        let count = 0;
        this.kings.forEach(k => k.checked = false);
        this.pieces.forEach(p => {
            p.findMoves();
            count += p.moves.length;
        });
    }

    getMoves(): Move[] {
        let moves: Move[] = [];
        this.pieces.forEach(p => {
            if (p.player == this.player) {
                p.moves.forEach(c => moves.push(new Move(p.cell, c)));
            }
        });
        return moves;
    }

    public evaluate(): number {
        if (this.status) {
            if (this.status == GameStatus.Checkmate) {
                return this.player == Player.White ? -WIN : WIN;
            } else
                return 0;
        } else {
            let value = 0;
            this.pieces.forEach(p => value += ((p.player == Player.White) ? p.value() : -p.value()));
            return value;
        }
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

    public static nextPlayer(player: Player) {
        return player == Player.White ? Player.Black : Player.White;
    }
}

const WIN = 1000000;