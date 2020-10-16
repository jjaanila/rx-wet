import { XYCoordinates } from "./coordinates";

const PIPE_WIDTH_PX = 20;
const PIPE_HEIGHT_PX = 60;

export class Pipe {
    private color = "red";
    private rotationDegrees = 0;
    private transformationMatrix: DOMMatrix;
    public width = PIPE_WIDTH_PX;
    public height = PIPE_HEIGHT_PX;

    constructor(public pos: XYCoordinates) {}

    getCenter = (): XYCoordinates => {
        return {
            x: this.pos.x + this.width / 2,
            y: this.pos.y + this.height / 2,
        };
    };

    /*
    Neat collision detection: https://stackoverflow.com/questions/41469794/html-canvas-and-javascript-rotating-objects-with-collision-detection
    */
    contains = (pos: XYCoordinates): boolean => {
        const inverseTransformationMatrixOfPipe = this.transformationMatrix.invertSelf();
        const posInPipeCoordinateSpace = new DOMPoint(pos.x, pos.y);
        const relativeClickPos = inverseTransformationMatrixOfPipe.transformPoint(posInPipeCoordinateSpace);
        return (
            relativeClickPos.x > -this.width / 2 &&
            relativeClickPos.y > -this.height / 2 &&
            relativeClickPos.x < this.width / 2 &&
            relativeClickPos.y < this.height / 2
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
        // Store the current context state (i.e. rotation, translation etc..)
        context.save();

        // Set the origin to the center of the image
        const center = this.getCenter();
        context.translate(center.x, center.y);

        // Convert degrees to radian
        const rad = (this.rotationDegrees * Math.PI) / 180;

        // Rotate the canvas around the origin
        context.rotate(-rad);

        context.fillStyle = this.color;
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        this.transformationMatrix = context.getTransform();

        // Restore canvas state as saved from above
        context.restore();
    };
}
