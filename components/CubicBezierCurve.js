import {
  Curve3,
  GizmoManager,
  MeshBuilder,
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  Vector3,
  StandardMaterial,
  Color3,
} from "@babylonjs/core";
import { Pane } from "tweakpane";

export class CubicBezierCurve {
  constructor(scene) {
    this.scene = scene;

    const p0 = MeshBuilder.CreateSphere("p0", { diameter: 0.2 }, this.scene);
    const p1 = MeshBuilder.CreateSphere("p1", { diameter: 0.2 }, this.scene);
    const p2 = MeshBuilder.CreateSphere("p2", { diameter: 0.2 }, this.scene);
    const p3 = MeshBuilder.CreateSphere("p3", { diameter: 0.2 }, this.scene);

    p0.position.set(-2.5, 0, 0);
    p1.position.set(-2.5, 2.5, 0);
    p2.position.set(2.5, 2.5, 0);
    p3.position.set(2.5, 0, 0);

    this.points = [p0, p1, p2, p3];

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true;

    this.points.forEach((point) => {
      point.onAfterWorldMatrixUpdateObservable.add(() => {
        this.createCurve(scene);
        const point = this.getAPointOnCurve(this.t);
        this.mainPoint.position = point;
      });

      point.actionManager = new ActionManager(scene);
      point.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
          gizmoManager.attachToMesh(point);
        })
      );
    });

    this.curve = this.createCurve(scene);

    this.mainPoint = MeshBuilder.CreateSphere(
      "mainPoint",
      { diameter: 0.2 },
      this.scene
    );
    const redMaterial = new StandardMaterial("red", this.scene);
    redMaterial.diffuseColor = new Color3(1, 0, 0);

    this.mainPoint.material = redMaterial;

    this.t = 0

    this.mainPoint.position = this.getAPointOnCurve(this.t);

    this.setupGUI();
  }

  createCurve(scene) {
    this.curve?.dispose();
    const cubicBezierVectors = Curve3.CreateCubicBezier(
      this.points[0].position,
      this.points[1].position,
      this.points[2].position,
      this.points[3].position,
      60
    );
    this.curve = Mesh.CreateLines(
      "cbezier",
      cubicBezierVectors.getPoints(),
      scene
    );
    this.curve.isPickable = false;
    return this.curve;
  }

  getAPointOnCurve(t) {
    const p0 = this.points[0].position;
    const p1 = this.points[1].position;
    const p2 = this.points[2].position;
    const p3 = this.points[3].position;

    const a = Vector3.Lerp(p0, p1, t);
    const b = Vector3.Lerp(p1, p2, t);
    const c = Vector3.Lerp(p2, p3, t);

    const d = Vector3.Lerp(a, b, t);
    const e = Vector3.Lerp(b, c, t);

    return Vector3.Lerp(d, e, t);
  }

  setupGUI() {
    const PARAMS = {
      t: 0,
    };
    this.pane = new Pane();

    this.pane
      .addBinding(PARAMS, "t", {
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on("change", (event) => {
        this.t = event.value;
        const point = this.getAPointOnCurve(this.t);
        this.mainPoint.position = point;
      });
  }
}
