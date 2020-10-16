import { XYCoordinates } from "./coordinates";

export class Tile {
    private color = "black";
    private rotationDegrees = 0;
    private transformationMatrix: DOMMatrix;
    public pipeLength: number;
    public pipeDiameter: number;

    constructor(public pos: XYCoordinates, private tileWidth: number, private tileHeight: number) {
        this.pipeLength = tileWidth * 0.2;
        this.pipeDiameter = tileHeight;
    }

    private get tileCenter() {
        return {
            x: this.pos.x + this.tileWidth / 2,
            y: this.pos.y + this.tileHeight / 2,
        };
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

    draw = (context: CanvasRenderingContext2D) => {
        // Draw background
        context.fillStyle = "gray";
        context.fillRect(this.pos.x, this.pos.y, this.tileWidth, this.tileHeight);

        // Store the current context state (i.e. rotation, translation etc..)
        context.save();

        // Set the origin to the center of the image
        context.translate(this.tileCenter.x, this.tileCenter.y);

        // Convert degrees to radian
        const rad = (this.rotationDegrees * Math.PI) / 180;

        // Rotate the canvas around the origin
        context.rotate(-rad);

        context.fillStyle = this.color;
        context.fillRect(-this.pipeLength / 2, -this.pipeDiameter / 2, this.pipeLength, this.pipeDiameter);

        this.transformationMatrix = context.getTransform();

        // Restore canvas state as saved from above
        context.restore();
    };
}
