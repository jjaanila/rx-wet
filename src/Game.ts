import { fromEvent } from "rxjs";
import { XYCoordinates } from "./coordinates";
import { Tile } from "./Tile";

const TICK_DURATION_MS = 100;

export class Game {
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;
    private numberOfHorizontalTiles = 24;
    private numberOfVerticalTiles = 24;
    private tileSize: {
        width: number;
        height: number;
    };
    private tilemap: any[][] = [];

    constructor() {
        this.updateCanvasSize();
        this.context = this.canvas.getContext("2d");
        this.createTilemap();
        document.body.insertBefore(this.canvas, document.getElementById("main"));
        fromEvent(window, "resize").subscribe(this.updateCanvasSize);
        fromEvent(this.canvas, "click").subscribe(this.onCanvasClick);
    }

    private updateCanvasSize = () => {
        this.canvas.width = window.innerWidth - 24;
        this.canvas.height = window.innerHeight - 24;
        this.tileSize = {
            width: this.canvas.width / this.numberOfHorizontalTiles,
            height: this.canvas.height / this.numberOfVerticalTiles,
        };
    };

    private createTilemap = () => {
        [...Array(this.numberOfHorizontalTiles)].map((_, horizontalIndex) => {
            this.tilemap[horizontalIndex] = [];
            [...Array(this.numberOfVerticalTiles)].map((_, verticalIndex) => {
                this.tilemap[horizontalIndex][verticalIndex] = new Tile(
                    {
                        x: horizontalIndex * this.tileSize.width,
                        y: verticalIndex * this.tileSize.height,
                    },
                    this.tileSize.width,
                    this.tileSize.height
                );
            });
        });
    };

    private onCanvasClick = (event: MouseEvent) => {
        const canvasRect = this.canvas.getBoundingClientRect();
        const clickCoordinates = {
            x: event.clientX - canvasRect.left,
            y: event.clientY - canvasRect.top,
        } as XYCoordinates;
        this.tilemap.forEach((layer) =>
            layer.forEach((pipe) => {
                if (pipe.contains(clickCoordinates)) {
                    pipe.onClick();
                }
            })
        );
    };

    private update = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tilemap.forEach((layer) => layer.forEach((pipe) => pipe.draw(this.context)));
    };

    start = () => {
        setInterval(this.update, TICK_DURATION_MS);
    };
}
