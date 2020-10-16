import { fromEvent } from "rxjs";
import { XYCoordinates } from "./coordinates";
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
        const clickCoordinates = {
            x: event.clientX - canvasRect.left,
            y: event.clientY - canvasRect.top,
        } as XYCoordinates;
        this.plumbing.forEach((layer) =>
            layer.forEach((pipe) => {
                if (pipe.contains(clickCoordinates)) {
                    pipe.onClick();
                }
            })
        );
    };

    private update = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.plumbing.forEach((layer) => layer.forEach((pipe) => pipe.draw(this.context)));
    };

    start = () => {
        setInterval(this.update, TICK_DURATION_MS);
    };
}
