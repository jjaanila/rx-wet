import { XYCoordinates } from "./coordinates";

const PIPE_WIDTH_PX = 20;
const PIPE_HEIGHT_PX = 60;

export class Pipe {
    private color = "red";
    private rotationDegrees = 0;
    public width = PIPE_WIDTH_PX;
    public height = PIPE_HEIGHT_PX;

    constructor(public pos: XYCoordinates) {}

    getCenter = (): XYCoordinates => {
        return {
            x: this.pos.x + this.width / 2,
            y: this.pos.y + this.height / 2
        };
    }

    onClick = () => {
        this.isClosed() ? this.open() : this.close();
    };

    open = () => {
        this.rotationDegrees = 0;
    }

    isClosed = () => {
        return this.rotationDegrees === 90;
    }

    close = () => {
        this.rotationDegrees = 90;
    }

    update = (ctx: CanvasRenderingContext2D) => {
        // Store the current context state (i.e. rotation, translation etc..)
        ctx.save()

        // Set the origin to the center of the image
        const center = this.getCenter();
        ctx.translate(center.x, center.y);

        // Convert degrees to radian 
        const rad = this.rotationDegrees * Math.PI / 180;

        // Rotate the canvas around the origin
        ctx.rotate(-rad);

        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        // Restore canvas state as saved from above
        ctx.restore();
    };

}
