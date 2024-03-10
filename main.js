import  { ArcRotateCamera, Engine, Scene, Vector3 } from "@babylonjs/core";
import "./style.css"
import { DefaultCube } from "./components/DefaultCube";
import { Quad } from "./components/Quad";
import { QuadRing } from "./components/QuadRing";

class App {
  constructor(canvas) {
    this.name = "app";

    this.canvas = canvas;
    this._engine = new Engine(this.canvas, true);

    this.scene = new Scene(this._engine);

    this.scene.createDefaultLight();

    this.camera = new ArcRotateCamera("camera", Math.PI/2, Math.PI/2, 10, new Vector3(0, 0, 0), this.scene);

    this.camera.attachControl(this.canvas, true);

    window.addEventListener("resize", () => {
      onResize(this._engine);
    });

    this.scene.onDisposeObservable.add(() =>
      window.removeEventListener("resize", () => {
        onResize(this._engine);
      })
    );

    // const quad = new Quad(this.scene);

    const quadRing = new QuadRing("quad-ring", {radius: 2, thickness: 1}, this.scene)

    this.renderLoop(this._engine, this.scene);
  }

  onResize(engine) {
    engine.resize(true);
  }

  renderLoop(engine, scene) {
    engine.runRenderLoop(() => {
      scene.render();
    });
  }
}


const canvas = document.getElementById("renderCanvas");

const app = new App(canvas);