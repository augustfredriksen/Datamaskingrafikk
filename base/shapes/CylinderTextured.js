'use strict';
import {BaseShape} from './BaseShape.js';
import {ImageLoader} from "../helpers/ImageLoader.js";
import {isPowerOfTwo1} from "../lib/utility-functions.js";

/**
 * Setter this.positions, this.colors og this.textureCoordinates for en kube.
 * Tegnes vha. gl.LINE_STRIP eller gl.TRIANGLES.
 */
export class Cylinder extends BaseShape {
    constructor(app, color = {red:0.8, green:0.0, blue:0.6, alpha:1}, wireFrame=false) {
        super(app);
        this.color = color;
        this.wireFrame = wireFrame;
    }

    setPositions() {
        //36 stk posisjoner:
        this.positions = []
        for (var i = 0.0; i <= 360; i++) {
      // degrees to radians
      var j = i * Math.PI / 180;
      // X Y Z
      var vert1 = [
        Math.cos(j),
        Math.sin(j),
      ];
      var vert2 = [
        Math.cos(j),
        Math.sin(j),
      ];
      
      this.positions = this.positions.concat(vert1, 0);
      this.positions = this.positions.concat(vert1, -8);


        }
    }

    setColors() {
        function randomColor() {
            return [Math.random(), Math.random(), Math.random(), 1.0];
        }
        

        this.colors = [];
        for (let face = 0; face < 360; face++) {
        let faceColor = [0, 0, 1.0, 1];
            this.colors.push(...randomColor());
    }
    }

    setTextureCoordinates() {
        const slices = 420;
        const loops = 1;
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
        const textureUrls = ['./../../base/textures/leaves.png'];

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
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexCount);
        }
    }
}
