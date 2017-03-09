import MessageBus from './MessageBus';
import * as d3 from 'd3';
import * as $ from 'jquery';

export default class BarChart {
    private selector;
    private aiResult;
    private selection;

    constructor(selector: string) {
        this.selector = selector;
        $(selector).mousemove(this.onMouseMove.bind(this));
        $(selector).mouseleave(this.onMouseLeave.bind(this));
    }

    private onMouseMove(e) {
        if (this.aiResult && this.aiResult.moves.length) {
            let moves = this.aiResult.moves;
            let offset = $(this.selector).offset();
            let barWidth = $(this.selector).width() / moves.length;
            let x = Math.floor((e.pageX - offset.left) /barWidth);
            if (x < moves.length) {
                this.setSelection(moves[x].move);
            }
        }
    }

    private onMouseLeave(e) {
        this.setSelection(undefined);
    }

    public setSelection(selection) {
        this.selection = selection;
        this.refresh(this.aiResult);
        MessageBus.get().publish('move-selected', this.selection);
    }

    public refresh(aiResult) {
        this.aiResult = aiResult;
        let moves = aiResult ? aiResult.moves : [];

        let container = d3.select(this.selector);

        let div = container.selectAll("div").data(moves, (d: any) => d.move);

        div.exit().remove();
        div.enter().append("div").attr('data-id', (d, i) => d.move);

        container.selectAll("div").data(moves, (d: any) => d.move).merge(div)
            .style("height", (d) => (d.value / aiResult.max * 100) + "%")
            .classed("selected", (d) => d.move === this.selection)
            .order()
    }
}