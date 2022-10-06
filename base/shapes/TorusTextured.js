'use strict';
import {BaseShape} from './BaseShape.js';
import {ImageLoader} from "../helpers/ImageLoader.js";
import {isPowerOfTwo1} from "../lib/utility-functions.js";

/**
 * Setter this.positions, this.colors og this.textureCoordinates for en kube.
 * Tegnes vha. gl.LINE_STRIP eller gl.TRIANGLES.
 */
export class Torus extends BaseShape {
    constructor(app, color = {red:0.8, green:0.0, blue:0.6, alpha:1}, wireFrame=false) {
        super(app);
        this.color = color;
        this.wireFrame = wireFrame;
    }

    setPositions() {
        const slices = 420;
        const loops = 200;
        const inner_rad = 0.6;
        const outer_rad = 3;

        this.positions = []

        for (let slice = 0; slice <= slices; ++slice) {
            let v = slice / slices;
            const slice_angle = v * 2 * Math.PI;
            const cos_slices = Math.cos(slice_angle);
            const sin_slices = Math.sin(slice_angle);
            const slice_rad = outer_rad + inner_rad * cos_slices;

            for (let loop = 0; loop <= loops; ++loop) {
                let u = loop / loops;

                const loop_angle = u * 2 * Math.PI;
                const cos_loops = Math.cos(loop_angle);
                const sin_loops = Math.sin(loop_angle);

                const x = slice_rad * cos_loops;
                const y = slice_rad * sin_loops;
                const z = inner_rad * sin_slices;

                this.positions.push(x, y, z);
            }
        }

    }
        
     setTextureCoordinates() {
        const slices = 420;
        const loops = 200;
        this.textureCoordinates = [];
        for (let slice = 0; slice <= slices; ++slice) {
            const v = slice / slices;
            
        for (let loop = 0; loop <= loops; ++loop) {
            const u = loop / loops;

            this.textureCoordinates.push(u);
            this.textureCoordinates.push(v);
        }
    }

    }

    /**
     * Denne kalles fra initBuffers() i BaseShape.
     */
    initTextures() {
        const textureUrls = ['./../../base/textures/chess_pattern.png'];

        if (this.textureCoordinates.length > 0) {
            //Laster textureUrls...
            let imageLoader = new ImageLoader();
            imageLoader.load((textureImages) => {
                    const textureImage = textureImages[0];
                    if (isPowerOfTwo1(textureImage.width) && isPowerOfTwo1(textureImage.height)) {
                        this.rectangleTexture = this.gl.createTexture();
                        //Teksturbildet er nå lastet fra server, send til GPU:
                        this.gl.bindTexture(this.gl.TEXTURE_2D, this.rectangleTexture);

                        //Unngaa at bildet kommer opp-ned:
                        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
                        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);   //NB! FOR GJENNOMSIKTIG BAKGRUNN!! Sett også this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);

                        //Laster teksturbildet til GPU/shader:
                        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, textureImage);

                        //Teksturparametre:
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
                        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);

                        this.gl.bindTexture(this.gl.TEXTURE_2D, null);

                        this.buffers.texture = this.gl.createBuffer();
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texture);
                        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates), this.gl.STATIC_DRAW);
                    }
                },
                textureUrls);
        }
    }

    handleKeys(elapsed) {
        // implementeres ved behov
    }

    draw(shaderInfo, elapsed, modelMatrix = (new Matrix4()).setIdentity()) {
        super.draw(shaderInfo, elapsed, modelMatrix);
        if (this.wireFrame) {
            this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.vertexCount);
        } else {
            this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.vertexCount);
        }
    }
}
