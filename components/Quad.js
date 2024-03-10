import { Mesh, ShaderMaterial, VertexData } from "@babylonjs/core";
import "./Shader"


export class Quad {
  constructor(scene) {
    this.scene = scene;
    this.camera = scene.activeCamera;

    this.quad = this.createQuad(scene);

    const material = this.createShaderMaterial(scene);

    this.quad.material = material;
  }

  createQuad(scene) {
    const quad = new Mesh("quad", scene);
    const vertices = [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0];
    const indices = [0, 1, 2, 3, 2, 1];
    const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

    const uvs = [1, 1, 0, 1, 1, 0, 0, 0];

    const vertexData = new VertexData();

    vertexData.positions = vertices;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;

    vertexData.applyToMesh(quad, true);
    return quad;
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
}
