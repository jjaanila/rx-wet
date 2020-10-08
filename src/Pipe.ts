const PIPE_WIDTH_PX = 20;
const PIPE_HEIGHT_PX = 60;

export class Pipe {
    private color = "red";
    public width = PIPE_WIDTH_PX;
    public height = PIPE_HEIGHT_PX;
    public pos: XYCoordinates;

    constructor(pos: XYCoordinates) {
        this.pos = pos;
    }

    click = () => {
        console.log(`I'm a Pipe at ${this.pos.x} ${this.pos.y}!`);
    };

    update = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x, this.pos.y, PIPE_WIDTH_PX, PIPE_HEIGHT_PX);
    };
}
