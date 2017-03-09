// import * as _ from 'lodash';
// import {Board, Win} from "./Board";
// import {platform} from "os";
// let __: any = _; //HACK: to overcome wrong types mapping for lodash
//
// export abstract class AI {
//     player: number;
//
//     abstract step();
//
//     abstract getResult();
// }
//
// export class MTS_AI extends AI {
//     private originalBoard: Board;
//     private node: Node;
//     private playCount: number;
//     private board: Board;
//     private evaluation: boolean = false;
//
//     constructor(board: Board, player: number) {
//         super();
//         this.player = player;
//         this.originalBoard = board;
//         this.node = new Node(null, Board.nextPlayer(player), null);
//         this.playCount = 0;
//     }
//
//     step() {
//         this.board = this.originalBoard.clone();
//         let win = this.selection();
//         if (!win) {
//             this.expansion();
//             win = this.simulation();
//         }
//         this.backpropogation(win);
//         this.playCount++;
//         // console.log('# cycle/sec: ', Math.round(1000 * this.node.playCount / (end - start)));
//     }
//
//     getResult() {
//         let res: any = {};
//         let moves: any[];
//         moves = _.map(this.node.children, (it: any) => {
//             return {move: it.move, value: it.playCount / this.playCount}
//         });
//         res.max = _.maxBy(moves, 'value').value;
//         res.mean = __.meanBy(moves, 'value');
//         res.confidence = (res.max - res.mean) / res.mean;
//         res.moves = _.orderBy(moves, 'value', 'desc');
//         return res;
//     }
//
//     selection(): Win {
//         if (this.node.parent) {
//             throw new Error('invalid start node: ' + this.node);
//         }
//         while (this.node.children && this.node.children.length) {
//             this.node.children.forEach(it => it.calculateUCB(this.node.playCount));
//             let maxUcb = -Number.MAX_VALUE;
//             let nextNode;
//             this.node.children.forEach(it => {
//                 if (it.ucb > maxUcb) {
//                     maxUcb = it.ucb;
//                     nextNode = it;
//                 }
//             });
//             if (nextNode) {
//                 this.board.setIndex(nextNode.move, nextNode.player);
//                 this.node = nextNode;
//             } else {
//                 console.log('error');
//             }
//         }
//         if (this.node.move !== null) {
//             if (this.node.win === null) {
//                 this.node.win = this.board.findWinnerAt(this.node.move);
//             }
//         }
//         return this.node.win;
//     }
//
//     expansion() {
//         if (this.node.children === null) {
//             this.node.children = [];
//             let moves = this.board.getMoves();
//             if (moves.length) {
//                 let np = Board.nextPlayer(this.node.player);
//                 moves.forEach(m => {
//                     let node = new Node(this.node, np, m);
//                     this.node.children.push(node);
//                     if (this.evaluation && this.node.layer === 0) {
//                         let copy = this.board.clone();
//                         copy.setIndex(node.move, np);
//                         node.evaluation = copy.evaluate();
//                         if (np == 2) {
//                             node.evaluation = -node.evaluation;
//                         }
//                         console.log('eval', node.evaluation);
//                     }
//                 });
//                 let moveIndex = Math.floor(Math.random() * this.node.children.length);
//                 let nextNode = this.node.children[moveIndex];
//                 this.board.setIndex(nextNode.move, nextNode.player);
//                 this.node = nextNode;
//             }
//         }
//     }
//
//     simulation(): Win {
//         let win = this.board.findWinnerAt(this.node.move);
//         if (win) {
//             return win;
//         } else {
//             return this.board.randomPlayout(Board.nextPlayer(this.node.player));
//         }
//     }
//
//     backpropogation(win) {
//         while (true) {
//             this.node.playCount++;
//             if (win) {
//                 if (win.player === this.node.player) {
//                     this.node.winCount++;
//                     // } else {
//                     //     this.node.winCount--;
//                 }
//             } else {
//                 this.node.winCount += 0.5; //half point for a tie
//             }
//             if (this.node.parent) {
//                 this.node = this.node.parent;
//             } else {
//                 break;
//             }
//         }
//     }
//
// }
//
// export class MiniMaxAI extends AI {
//     private move: string;
//     private originalBoard: Board;
//     private counter = 0;
//     private depth: number;
//
//     constructor(board: Board, player: number, depth: number) {
//         super();
//         this.player = player;
//         this.originalBoard = board;
//         this.depth = depth;
//     }
//
//     step() {
//         this.move = this.miniMax(this.originalBoard, this.player, this.depth);
//         // this.move = this.alphaBeta(this.originalBoard, this.player, this.depth, -Number.MAX_VALUE, Number.MAX_VALUE);
//         console.log('evaluations #', this.counter);
//     }
//
//     getResult() {
//         return {
//             max: 0,
//             mean: 0,
//             confidence: 0,
//             moves: [this.move]
//         };
//     }
//
//     private miniMax(board: Board, player: number, currentDepth: number) {
//         let successors = board.getMoves();
//         if (currentDepth == 0 || successors.length == 0) {
//             this.counter++;
//             return {value: board.evaluate()};
//         }
//
//         let value = null;
//         let selectedMove = null;
//         successors.forEach(move => {
//             let copy = board.clone();
//             copy.setIndex(move, player);
//             let mm = this.miniMax(copy, Board.nextPlayer(player), currentDepth - 1);
//             if (selectedMove == null //initial value
//                 || (player === 1 && mm.value > value)   //max
//                 || (player === 2 && mm.value < value)) { //min
//                 selectedMove = {
//                     move: move,
//                     value: value
//                 };
//                 value = mm.value;
//             }
//         });
//
//         return selectedMove;
//     }
//
//     alphaBeta(board: Board, player: number, currentDepth: number, a: number, b: number) {
//         let successors = board.getMoves();
//         if (currentDepth == 0 || successors.length == 0) {
//             this.counter++;
//             return {value: board.evaluate()};
//         }
//
//         let value: number = null;
//         let selectedMove = null;
//
//         for (let i = 0; i < successors.length; i++) {
//             let move = successors[i];
//             let copy = board.clone();
//             copy.setIndex(move, player);
//             let mm = this.alphaBeta(copy, Board.nextPlayer(player), currentDepth - 1, a, b);
//             if (player == 1) {
//                 if (value == null || mm.value > value) {
//                     value = mm.value;
//                     selectedMove = {
//                         move: move,
//                         value: value
//                     };
//                 }
//                 a = Math.max(a, value);
//                 if (b <= a) {
//                     break;
//                 }
//             } else {
//                 if (value == null || mm.value < value) {
//                     value = mm.value;
//                     selectedMove = {
//                         move: move,
//                         value: value
//                     };
//                 }
//                 b = Math.min(b, value);
//                 if (b <= a) {
//                     break;
//                 }
//             }
//         }
//         return selectedMove;
//     }
//
// }
//
// class Node {
//     public win: Win = null;
//     public parent: Node;
//     public player: number;
//     public move;
//     public children = null;
//     public playCount: number = 0;
//     public winCount: number = 0;
//     public ucb: number;
//     public evaluation: number = 0;
//     public layer: number;
//
//     constructor(parent: Node, player: number, move: string) {
//         this.parent = parent;
//         this.player = player;
//         this.move = move;
//         this.layer = parent ? parent.layer + 1 : 0;
//     }
//
//     calculateUCB(total) {
//         const C = 1.4;
//         let value;
//         let exploration;
//         if (this.playCount === 0) {
//             value = 0;
//             exploration = 1000000;
//         } else {
//             exploration = (C * Math.sqrt(Math.log(total) / this.playCount));
//             value = this.winCount / this.playCount;
//         }
//         this.ucb = value + exploration;
//     }
// }



// randomPlayout(player: number): Player {
//     while (true) {
//         let moves = this.getMoves();
//         if (moves.length == 0) {
//             break;
//         }
//         let moveIndex = Math.floor(Math.random() * moves.length);
//         let move: any = moves[moveIndex];
//         let c = this.cell(move);
//         this.set(c.x, c.y, player);
//         let win = this.findWinner(c.x, c.y);
//         if (win) {
//             return win;
//         } else {
//             player = Board.nextPlayer(player);
//         }
//     }
//     return null;
// }
