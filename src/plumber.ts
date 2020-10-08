import { Pipe } from "./Pipe";

export function getNewRandomPlumbing() {
    const plumbing: Pipe[][] = [];
    [0, 1, 2].forEach((layerIdx) => {
        plumbing[layerIdx] = [];
        [0, 1, 2, 3, 4, 5].forEach((pipeIdx) => {
            plumbing[layerIdx][pipeIdx] = new Pipe({
                x: pipeIdx * 50,
                y: layerIdx * 100,
            });
        });
    });
    return plumbing;
}
