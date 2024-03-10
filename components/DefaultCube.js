import { MeshBuilder } from "@babylonjs/core";

export class DefaultCube {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.activeCamera;
        
        this.box = MeshBuilder.CreateBox("box", { size: 2 }, this.scene);

        return this.box;
    }
}