import * as _ from 'lodash';
import {Board, GameStatus, Player, Move} from "./Chess";
let __: any = _; //HACK: to overcome wrong types mapping for lodash

export class MonteCarloTreeSearch {
    private originalBoard: Board;
    private node: Node;
    private playCount: number;
    private board: Board;
    private evaluation: boolean = false;

    constructor(board: Board) {
        this.originalBoard = board;
        this.node = new Node(null, board.player, null);
        this.playCount = 0;
    }

    step() {
        this.board = this.originalBoard.clone();
        this.board.analyze();
        let win = this.selection();
        if (!win) {
            this.expansion();
            win = this.simulation();
        }
        this.backpropogation(win);
        this.playCount++;
        // console.log('# cycle/sec: ', Math.round(1000 * this.node.playCount / (end - start)));
    }

    getResult() {
        let res: any = {};
        let moves: any[];
        moves = _.map(this.node.children, (it: any) => {
            return {move: it.move, value: it.playCount / this.playCount}
        });
        res.max = _.maxBy(moves, 'value').value;
        res.mean = __.meanBy(moves, 'value');
        res.confidence = (res.max - res.mean) / res.mean;
        res.moves = _.orderBy(moves, 'value', 'desc');
        return res;
    }

    selection(): Win {
        if (this.node.parent) {
            throw new Error('invalid start node: ' + this.node);
        }
        while (this.node.children && this.node.children.length) {
            this.node.children.forEach(it => it.calculateUCB(this.node.playCount));
            let maxUcb = -Number.MAX_VALUE;
            let nextNode;
            this.node.children.forEach(it => {
                if (it.ucb > maxUcb) {
                    maxUcb = it.ucb;
                    nextNode = it;
                }
            });
            if (nextNode) {
                this.board.doMove(nextNode.move);
                this.board.player = Board.nextPlayer(this.board.player);
                this.node = nextNode;
            } else {
                console.log('error');
            }
        }
        if (this.node.move !== null) {
            if (this.node.win === null) {
                this.board.analyze();
                if (this.board.status) {
                    this.node.win = {player: Board.nextPlayer(this.board.player)};
                }
            }
        }
        return this.node.win;
    }

    expansion() {
        if (this.node.children === null) {
            this.node.children = [];
            let moves = this.board.getMoves();
            if (moves.length) {
                let np = Board.nextPlayer(this.node.player);
                moves.forEach(m => {
                    let node = new Node(this.node, np, m);
                    this.node.children.push(node);
                });
                let moveIndex = Math.floor(Math.random() * this.node.children.length);
                let nextNode = this.node.children[moveIndex];
                this.board.makeMove(nextNode.move);
                this.node = nextNode;
            }
        }
    }

    simulation(): Win {
        while (true) {
            if (this.board.status) {
                if (this.board.status == GameStatus.Checkmate) {
                    return {player: Board.nextPlayer(this.board.player)};
                } else {
                    return {player: null};
                }
            }
            let moves = this.board.getMoves();
            if (moves.length == 0) {
                return {player: null};
            }
            let moveIndex = Math.floor(Math.random() * moves.length);
            this.board.makeMove(moves[moveIndex]);
        }
    }

    backpropogation(win: Win) {
        while (true) {
            this.node.playCount++;
            if (win) {
                if (win.player === this.node.player) {
                    this.node.winCount++;
                    // } else {
                    //     this.node.winCount--;
                }
            } else {
                this.node.winCount += 0.5; //half point for a tie
            }
            if (this.node.parent) {
                this.node = this.node.parent;
            } else {
                break;
            }
        }
    }

}

class Node {
    public win: Win = null;
    public parent: Node;
    public player: Player;
    public move: Move;
    public children: Node[] = null;
    public playCount: number = 0;
    public winCount: number = 0;
    public ucb: number;
    public evaluation: number = 0;
    public layer: number;

    constructor(parent: Node, player: Player, move: Move) {
        this.parent = parent;
        this.player = player;
        this.move = move;
        this.layer = parent ? parent.layer + 1 : 0;
    }

    calculateUCB(total) {
        const C = 1.4;
        let value;
        let exploration;
        if (this.playCount === 0) {
            value = 0;
            exploration = 1000000;
        } else {
            exploration = (C * Math.sqrt(Math.log(total) / this.playCount));
            value = this.winCount / this.playCount;
        }
        this.ucb = value + exploration;
    }
}

interface Win {
    player: Player;
}


