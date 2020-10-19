import { fromEvent } from "rxjs";
import { XYCoordinates } from "./coordinates";
import { SourceTile } from "./SourceTile";
import { Tile } from "./Tile";

const TICK_DURATION_MS = 100;

export class Game {
    private canvas = document.createElement("canvas");
    private context: CanvasRenderingContext2D;
    private numberOfHorizontalTiles = 4;
    private numberOfVerticalTiles = 4;
    private tileSize: {
        width: number;
        height: number;
    };
    private tilemap: (SourceTile | Tile)[][] = [];

    constructor() {
        this.updateCanvasSize();
        this.context = this.canvas.getContext("2d");
        this.tilemap = this.createTilemap();
        this.setNeighbours();
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
        const tilemap: (Tile | SourceTile)[][] = [];
        [...Array(this.numberOfHorizontalTiles)].forEach((_, horizontalIndex) => {
            tilemap[horizontalIndex] = [];
            [...Array(this.numberOfVerticalTiles)].forEach((_, verticalIndex) => {
                const TileClass = verticalIndex === 0 ? SourceTile : Tile;
                tilemap[horizontalIndex][verticalIndex] = new TileClass(
                    {
                        x: horizontalIndex * this.tileSize.width,
                        y: verticalIndex * this.tileSize.height,
                    },
                    this.tileSize.width,
                    this.tileSize.height
                );
            });
        });
        return tilemap;
    };

    private setNeighbours() {
        this.tilemap.forEach((_, horizontalIndex) => {
            this.tilemap[horizontalIndex].forEach((_, verticalIndex) => {
                this.tilemap[horizontalIndex][verticalIndex].setNeighbourTiles({
                    top: verticalIndex > 0 ? this.tilemap[horizontalIndex][verticalIndex - 1] : undefined,
                    bottom:
                        verticalIndex < this.tilemap[horizontalIndex].length - 1
                            ? this.tilemap[horizontalIndex][verticalIndex + 1]
                            : undefined,
                    left: horizontalIndex > 0 ? this.tilemap[horizontalIndex - 1][verticalIndex] : undefined,
                    right:
                        horizontalIndex < this.tilemap.length - 1
                            ? this.tilemap[horizontalIndex + 1][verticalIndex]
                            : undefined,
                });
            });
        });
    }

    private onCanvasClick = (event: MouseEvent) => {
        const canvasRect = this.canvas.getBoundingClientRect();
        const clickCoordinates = {
            x: event.clientX - canvasRect.left,
            y: event.clientY - canvasRect.top,
        } as XYCoordinates;
        this.tilemap.forEach((layer) =>
            layer.forEach((tile) => {
                if (tile.contains(clickCoordinates)) {
                    tile.onClick();
                }
            })
        );
    };

    private update = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.tilemap.forEach((layer) => layer.forEach((tile) => tile.update(this.context)));
    };

    start = () => {
        setInterval(this.update, TICK_DURATION_MS);
    };
}
