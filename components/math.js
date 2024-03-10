import { Vector3 } from "@babylonjs/core";

export const TAU = Math.PI * 2;

export const getUnitVector = (angle) => {
    return new Vector3(Math.cos(angle), Math.sin(angle), 0);
}