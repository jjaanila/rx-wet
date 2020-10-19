import { XYCoordinates } from "./coordinates";
import { Observable, Subscription, Subject } from "rxjs";

export interface ConnectorMessage {
    pressure: number;
}

interface Connectors {
    top?: Observable<ConnectorMessage> | Subject<ConnectorMessage>;
    bottom?: Observable<ConnectorMessage> | Subject<ConnectorMessage>;
    left?: Observable<ConnectorMessage> | Subject<ConnectorMessage>;
    right?: Observable<ConnectorMessage> | Subject<ConnectorMessage>;
}

interface Neighbours {
    top?: {
        tile: Tile;
        subscription: Subscription;
        pressure: number;
    };
    right?: {
        tile: Tile;
        subscription: Subscription;
        pressure: number;
    };
    left?: {
        tile: Tile;
        subscription: Subscription;
        pressure: number;
    };
    bottom?: {
        tile: Tile;
        subscription: Subscription;
        pressure: number;
    };
}

interface NeighbourTiles {
    top?: Tile;
    right?: Tile;
    left?: Tile;
    bottom?: Tile;
}

const flowSpeedConstant = 200;

export class Tile {
    private neighbours: Neighbours = {};
    protected pipeLength: number;
    protected pipeDiameter: number;
    protected selfGeneratedPressure: number = 0;
    protected rotationDegrees = 0;
    protected connectors: Connectors = {};
    protected fillRatio: number = 0; // From 0 to 1

    constructor(public pos: XYCoordinates, protected tileWidth: number, protected tileHeight: number) {
        this.pipeLength = this.tileHeight;
        this.pipeDiameter = this.tileWidth * 0.2;
    }

    protected get tileCenter() {
        return {
            x: this.pos.x + this.tileWidth / 2,
            y: this.pos.y + this.tileHeight / 2,
        };
    }

    protected drawBackground(context: CanvasRenderingContext2D) {
        context.fillStyle = "gray";
        context.fillRect(this.pos.x, this.pos.y, this.tileWidth, this.tileHeight);
    }

    private getOppositeSide(side: keyof Neighbours): keyof Neighbours {
        return side === "top"
            ? "bottom"
            : side === "bottom"
            ? "top"
            : side === "left"
            ? "right"
            : side === "right"
            ? "left"
            : undefined;
    }

    getNeighbourTiles() {
        return {
            top: this.neighbours?.top?.tile,
            bottom: this.neighbours?.bottom?.tile,
            left: this.neighbours?.left?.tile,
            right: this.neighbours?.right?.tile,
        };
    }

    private observeNeighbour(neighbourTile: Tile, side: keyof Neighbours) {
        const oppositeSide = this.getOppositeSide(side);
        if (neighbourTile.connectors[oppositeSide]) {
            neighbourTile.connectors[oppositeSide].subscribe({
                next: (message: ConnectorMessage) => {
                    this.neighbours[side].pressure = message.pressure;
                },
                error: (err: Error) => {
                    console.error(err);
                },
                complete: () => {
                    console.log("complete");
                    this.neighbours[side].pressure = 0;
                    delete this.neighbours[side];
                },
            });
        }
    }

    setNeighbourTiles(neighbourTiles: NeighbourTiles) {
        Object.keys(neighbourTiles).forEach((side) => {
            this.neighbours[side] = {
                tile: neighbourTiles[side],
                subscription:
                    neighbourTiles[side] && this.observeNeighbour(neighbourTiles[side], side as keyof NeighbourTiles),
                pressure: 0,
            };
        });
    }

    contains = (pos: XYCoordinates): boolean => {
        return (
            pos.x > this.pos.x &&
            pos.x < this.pos.x + this.tileWidth &&
            pos.y > this.pos.y &&
            pos.y < this.pos.y + this.tileHeight
        );
    };

    onClick = () => {
        this.isClosed() ? this.open() : this.close();
    };

    open = () => {
        this.rotationDegrees = 0;
    };

    isClosed = () => {
        return this.rotationDegrees === 90;
    };

    close = () => {
        this.rotationDegrees = 90;
    };

    get pressure() {
        return (
            Object.keys(this.neighbours).reduce((pressure, side) => {
                return pressure + this.neighbours[side].pressure;
            }, 0) + this.selfGeneratedPressure
        );
    }

    protected updateFillRatio() {
        const pipeArea = this.pipeDiameter * this.pipeLength;
        const fillSpeed = this.pressure * this.pipeDiameter * flowSpeedConstant;
        this.fillRatio = Math.min((this.fillRatio * pipeArea + fillSpeed) / pipeArea, 1);
    }

    update = (context: CanvasRenderingContext2D) => {
        this.updateFillRatio();
        this.drawBackground(context);

        // Store the current context state (i.e. rotation, translation etc..)
        context.save();

        // Set the origin to the center of the image
        context.translate(this.tileCenter.x, this.tileCenter.y);

        // Convert degrees to radian
        const rotationRad = (this.rotationDegrees * Math.PI) / 180;

        // Rotate the canvas around the origin
        context.rotate(-rotationRad);

        context.fillStyle = "black";
        context.fillRect(-this.pipeDiameter / 2, -this.pipeLength / 2, this.pipeDiameter, this.pipeLength);

        context.fillStyle = "blue";
        context.fillRect(
            -this.pipeDiameter / 2,
            -this.pipeLength / 2,
            this.pipeDiameter,
            this.pipeLength * this.fillRatio
        );

        // Restore canvas state as saved from above
        context.restore();
    };
}
