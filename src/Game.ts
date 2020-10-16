import { fromEvent } from "rxjs";
import { Pipe } from "./Pipe";
import { getNewRandomPlumbing } from "./plumber";

const TICK_DURATION_MS = 1;

export class Game {
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;
    private plumbing: Pipe[][] = getNewRandomPlumbing();

    constructor() {
        this.updateCanvasSize();
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.getElementById("main"));
        fromEvent(window, "resize").subscribe(this.updateCanvasSize);
        fromEvent(this.canvas, "click").subscribe(this.onCanvasClick);
    }

    private updateCanvasSize = () => {
        this.canvas.width = window.innerWidth - 24;
        this.canvas.height = window.innerHeight - 24;
    };

    private onCanvasClick = (event: MouseEvent) => {
        const canvasRect = this.canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        this.plumbing.forEach((layer) =>
            layer.forEach((pipe) => {
                if (y > pipe.pos.y && y < pipe.pos.y + pipe.height && x > pipe.pos.x && x < pipe.pos.x + pipe.width) {
                    pipe.onClick();
                }
            })
        );
    };

    private update = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.plumbing.forEach((layer) => layer.forEach((pipe) => pipe.update(this.context)));
    };

    start = () => {
        setInterval(this.update, TICK_DURATION_MS);
    };
}
