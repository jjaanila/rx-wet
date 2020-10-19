import { Subject } from "rxjs";
import { XYCoordinates } from "./coordinates";
import { Tile, ConnectorMessage } from "./Tile";

export class SourceTile extends Tile {
    selfGeneratedPressure = 0.015;
    protected pipeLength: number;
    protected pipeDiameter: number;
    public connectors: {
        bottom: Subject<ConnectorMessage>;
    };
    constructor(public pos: XYCoordinates, protected tileWidth: number, protected tileHeight: number) {
        super(pos, tileWidth, tileHeight);
        this.pipeLength = this.tileHeight / 2;
        this.pipeDiameter = this.tileWidth * 0.2;
        this.connectors = {
            bottom: new Subject(),
        };
    }

    onClick = () => {
        // Not clickable
    };

    private sendEvents() {
        if (this.fillRatio === 1) {
            Object.keys(this.connectors).forEach((connectorKey) =>
                this.connectors[connectorKey].next({
                    pressure: this.pressure,
                })
            );
        }
    }

    update = (context: CanvasRenderingContext2D) => {
        this.updateFillRatio();
        this.sendEvents();
        this.drawBackground(context);

        // Store the current context state (i.e. rotation, translation etc..)
        context.save();

        // Set the origin to the center of the image
        context.translate(this.tileCenter.x, this.tileCenter.y);

        context.fillStyle = "black";
        context.fillRect(
            -this.pipeDiameter / 2,
            -this.pipeLength / 2 + this.pipeLength / 2,
            this.pipeDiameter,
            this.pipeLength
        );

        context.fillStyle = "blue";
        context.fillRect(
            -this.pipeDiameter / 2,
            -this.pipeLength / 2 + this.pipeLength / 2,
            this.pipeDiameter,
            this.pipeLength * this.fillRatio
        );

        // Restore canvas state as saved from above
        context.restore();
    };
}
