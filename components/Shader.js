import { Effect } from "@babylonjs/core";

Effect.ShadersStore["uvVertexShader"] = `
        precision highp float;
        attribute vec3 position;
        attribute vec3 normal;
        attribute vec2 uv;

        uniform mat4 worldViewProjection;
        

        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
            vec4 p = vec4(position, 1.);
            gl_Position = worldViewProjection * p;
            vNormal = normal;
            vUv = uv;
        }
`;

Effect.ShadersStore["uvFragmentShader"] = `
        precision highp float;

        uniform sampler2D textureSampler;

        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
            vec4 textureColor = texture2D(textureSampler, vUv);
            gl_FragColor = vec4(1.,0.,0.,1.);
            gl_FragColor.rgb = normalize(vNormal);
            gl_FragColor.rgb = vec3(vUv, 0.);
            // gl_FragColor.rgb = textureColor.rgb;
        }
`;