import { Observable, fromEvent } from "rxjs";

export class Game {
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;
    constructor() {
        this.updateCanvasSize();
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        fromEvent(window, "resize").subscribe(this.updateCanvasSize);
    }

    updateCanvasSize = () => {
        this.canvas.width = window.innerWidth - 24;
        this.canvas.height = window.innerHeight - 24;
    };
}
