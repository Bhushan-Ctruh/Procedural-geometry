import { Mesh, ShaderMaterial, Vector3, VertexData } from "@babylonjs/core";
import { TAU, getUnitVector } from "./Math";
import { Pane } from "tweakpane";
import "./Shader"

export class QuadRing {
  constructor(name, { radius, thickness, subdivisions = 3 }, scene) {
    this.name = name;

    this.scene = scene;
    this.camera = scene.activeCamera;

    this.innerRadius = radius;
    this.thickness = thickness;
    this.subdivisions = subdivisions;

    this.outerRadius = radius + thickness;

    this.mesh = this.createRing(scene);
    this.material = this.createShaderMaterial(scene);
    this.mesh.material = this.material

    this.mesh.position.z += 0.5

    this.gUISetup(scene)


  }

  createRing(scene) {
    const mesh = new Mesh(this.name, scene);

    const totalVertices = this.subdivisions * 2;

    const vertices = [];
    const normals = [];
    const uvs = [];

    for (let i = 0; i < this.subdivisions; i++) {
      const angle = (i / this.subdivisions) * TAU;
      const dir = getUnitVector(angle);

      const amplitude = Math.cos(angle * 4) * 0;

      const zOffset = new Vector3(0,0,1).scale(amplitude);

      const outerRingVertex = dir.scale(this.outerRadius).add(zOffset);

      const innerRingVertex = dir.scale(this.innerRadius).add(zOffset);


      vertices.push(
        outerRingVertex.x,
        outerRingVertex.y,
        outerRingVertex.z,
        innerRingVertex.x,
        innerRingVertex.y,
        innerRingVertex.z
      );

      uvs.push(angle/TAU, 1);
      uvs.push(angle/TAU, 0);

    }

    const indices = [];

    for (let i = 0; i < this.subdivisions; i++) {
      const outerRootIndex = i * 2;
      const innerRootIndex = i * 2 + 1;

      const outerNextIndex = (outerRootIndex + 2) % totalVertices;
      const innerNextIndex = (innerRootIndex + 2) % totalVertices;
      indices.push(
        innerRootIndex,
        innerNextIndex,
        outerRootIndex,
        innerNextIndex,
        outerNextIndex,
        outerRootIndex
      );
    }

    const vertexData = new VertexData();

    vertexData.positions = vertices;
    vertexData.indices = indices;
    VertexData.ComputeNormals(vertices, indices, normals);
    // vertexData.computeNormals();
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    vertexData.applyToMesh(mesh, true);

    console.log(uvs, "UVS");
    return mesh;
  }


  createShaderMaterial(scene) {
    const shaderMaterial = new ShaderMaterial(
      "shader",
      scene,
      {
        vertexElement: "uv",
        fragmentElement: "uv",
      },
      {
        attributes: ["position", "normal", "uv"],
        uniforms: ["worldViewProjection", "world", "vNormal"],
      }
    );

    return shaderMaterial;
  }

  gUISetup(scene) {
    const PARAMS = {
      radius : this.innerRadius,
      thickness: this.thickness,
      subdivisions: this.subdivisions,
    };

    this.pane = new Pane();

    this.pane
      .addBinding(PARAMS, "radius", {
        min: 0.01,
        max: 10,
      })
      .on("change", (event) => {
        this.innerRadius = event.value;
        this.outerRadius = this.innerRadius + this.thickness;
        this.mesh?.dispose();
        this.mesh = this.createRing(scene);
        this.mesh.position.z += 0.5
        this.mesh.material = this.material
      });

    this.pane
      .addBinding(PARAMS, "thickness", {
        min: 0.1,
        max: 10,
      })
      .on("change", (event) => {
        this.thickness = event.value;
        this.outerRadius = this.innerRadius + this.thickness;
        this.mesh?.dispose();
        this.mesh = this.createRing(scene);
        this.mesh.position.z += 0.5
        this.mesh.material = this.material
      });

    this.pane
      .addBinding(PARAMS, "subdivisions", {
        min: 3,
        max: 128,
        step: 1,
      })
      .on("change", (event) => {
        this.subdivisions = event.value;
        this.mesh?.dispose();
        this.mesh = this.createRing(scene);
        this.mesh.position.z += 0.5
        this.mesh.material = this.material
      });
  }
}
