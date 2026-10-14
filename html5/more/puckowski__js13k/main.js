class mat4 {
    static create() {
        let out = new Float32Array(16);
        out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
        out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
        out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
        out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
        return out;
    }

    static perspective(out, fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy / 2);
        let nf = 1 / (near - far);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
        return out;
    }

    static translate(out, a, v) {
        let x = v[0], y = v[1], z = v[2];
        if (a === out) {
            out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
        } else {
            out[0] = a[0]; out[1] = a[1]; out[2] = a[2]; out[3] = a[3];
            out[4] = a[4]; out[5] = a[5]; out[6] = a[6]; out[7] = a[7];
            out[8] = a[8]; out[9] = a[9]; out[10] = a[10]; out[11] = a[11];
            out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
        }
        return out;
    }
}

class TextureTumbler {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = new Uint8Array(width * height * 4);
    }

    drawRectangle(x, y, width, height, r, g, b, a) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                let index = (i * this.width + j) * 4;
                this.data[index] = r;
                this.data[index + 1] = g;
                this.data[index + 2] = b;
                this.data[index + 3] = a;
            }
        }
        return this;
    }

    addRandomNoise(baseR, baseG, baseB, flagFull = false) {
        const adjustColor = (base) => {
            const variation = Math.floor(base * 0.2);
            const min = Math.max(0, base - variation);
            const max = Math.min(255, base + variation);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        const blockSize = 8;
        for (let i = 0; i < this.height; i += blockSize) {
            for (let j = 0; j < this.width; j += blockSize) {
                const noiseR = adjustColor(baseR);
                const noiseG = adjustColor(baseG);
                const noiseB = adjustColor(baseB);

                for (let bi = 0; bi < blockSize; bi++) {
                    for (let bj = 0; bj < blockSize; bj++) {
                        if (i + bi >= this.height || j + bj >= this.width) continue;

                        let index = ((i + bi) * this.width + (j + bj)) * 4;
                        if (flagFull) {
                            this.data[index] = noiseR;
                            this.data[index + 1] = noiseG;
                            this.data[index + 2] = noiseB;
                        } else {
                            this.data[index] = Math.floor(this.data[index] * 0.50 + noiseR * 0.50);
                            this.data[index + 1] = Math.floor(this.data[index + 1] * 0.50 + noiseG * 0.50);
                            this.data[index + 2] = Math.floor(this.data[index + 2] * 0.50 + noiseB * 0.50);
                        }
                        this.data[index + 3] = 255; // Fully opaque
                    }
                }
            }
        }
        return this;
    }

    copyRows(startCopyRow, startDrawRow) {
        const rowCount = Math.floor(this.height * 0.25);
        startCopyRow += rowCount;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < this.width; j++) {
                const sourceIndex = ((startCopyRow - rowCount + i) * this.width + j) * 4;
                const destIndex = ((startDrawRow + i) * this.width + j) * 4;
                this.data[destIndex] = this.data[sourceIndex];
                this.data[destIndex + 1] = this.data[sourceIndex + 1];
                this.data[destIndex + 2] = this.data[sourceIndex + 2];
                this.data[destIndex + 3] = this.data[sourceIndex + 3];
            }
        }
        return this;
    }

    getData() {
        return this.data;
    }
}

const maps = {
    '1': [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 3, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

    '2': [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 3, 1],
        [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
};

let playingAudio = false;
let level = 1;
let lives = 3;
let victories = 0;
let map = maps['1'];

const sphereTargetMap = new Map();
sphereTargetMap.set(1, 2);
sphereTargetMap.set(2, 1);

let cameraX = 1, cameraY = 8;
let sphereMapX = 1, sphereMapY = 1;

function computeSphereOffsets(cameraX, cameraY, sphereMapX, sphereMapY, sphereHeight = -0.25) {
    return [
        -cameraX + sphereMapX, // X offset
        sphereHeight,                // Y offset (height above the floor)
        -cameraY + sphereMapY + 0.5  // Z offset
    ];
}

// Function to move the sphere
function moveSphere(newX, newY) {
    sphereMapX = newX;
    sphereMapY = newY;
    drawScene(gl, programInfo, buffers, wallTexture, floorMap.get(level), sphereBuffer);
}

// Usage example for drawing the scene
let sphereOffsets;

const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

const tumblerWall1 = new TextureTumbler(256, 256);
tumblerWall1.drawRectangle(0, 0, 86, 32, 63, 62, 62, 255)
    .drawRectangle(86, 0, 86, 32, 92, 91, 90, 255)
    .drawRectangle(172, 0, 86, 32, 63, 62, 62, 255)
    .drawRectangle(0, 32, 64, 32, 112, 111, 110, 255)
    .drawRectangle(64, 32, 64, 32, 80, 79, 79, 255)
    .drawRectangle(128, 32, 64, 32, 112, 111, 110, 255)
    .drawRectangle(192, 32, 64, 32, 80, 79, 79, 255)
    .copyRows(0, 64)
    .copyRows(32, 96)
    .copyRows(0, 128)
    .copyRows(32, 160)
    .copyRows(0, 192)
    .copyRows(32, 224)
    .addRandomNoise(85, 84, 84);
let wallTexture = buildTexture(gl, 256, 256, tumblerWall1);

const tumblerWall2 = new TextureTumbler(256, 256);
tumblerWall2.drawRectangle(0, 0, 128, 32, 98, 74, 58, 255)
    .drawRectangle(128, 0, 128, 32, 113, 89, 73, 255)
    .drawRectangle(0, 32, 128, 32, 113, 64, 48, 255)
    .drawRectangle(128, 32, 128, 32, 108, 84, 68, 255)
    .copyRows(0, 64)
    .copyRows(32, 96)
    .copyRows(0, 128)
    .copyRows(32, 160)
    .copyRows(0, 192)
    .copyRows(32, 224)
    .addRandomNoise(99, 75, 59);

const tumblerFloor1 = new TextureTumbler(256, 256);
tumblerFloor1.drawRectangle(0, 0, 86, 32, 146, 135, 121, 255)
    .drawRectangle(86, 0, 86, 32, 131, 121, 108, 255)
    .drawRectangle(172, 0, 86, 32, 146, 135, 121, 255)
    .drawRectangle(0, 32, 64, 32, 116, 108, 96, 255)
    .drawRectangle(64, 32, 64, 32, 102, 94, 84, 255)
    .drawRectangle(128, 32, 64, 32, 116, 108, 96, 255)
    .drawRectangle(192, 32, 64, 32, 102, 94, 84, 255)
    .copyRows(0, 64)
    .copyRows(32, 96)
    .copyRows(0, 128)
    .copyRows(32, 160)
    .copyRows(0, 192)
    .copyRows(32, 224)
    .addRandomNoise(90, 48, 16);
const floorTexture = buildTexture(gl, 256, 256, tumblerFloor1);

const tumblerFloor2 = new TextureTumbler(256, 256);
tumblerFloor2.addRandomNoise(0, 105, 62);
const grassTexture = buildTexture(gl, 256, 256, tumblerFloor2);

const tumblerPerson1 = new TextureTumbler(256, 256);
tumblerPerson1.drawRectangle(0, 0, 256, 256, 255, 255, 255, 0)
    .drawRectangle(112, 32, 16, 16, 0, 0, 0, 255)
    .drawRectangle(118, 48, 4, 96, 0, 0, 0, 255)
    .drawRectangle(76, 76, 88, 4, 0, 0, 0, 255)
    .drawRectangle(114, 144, 4, 96, 0, 0, 0, 255)
    .drawRectangle(122, 144, 4, 96, 0, 0, 0, 255)
    .drawRectangle(122, 144, 4, 96, 0, 0, 0, 255);
const personTexture = buildTexture(gl, 256, 256, tumblerPerson1);

const floorMap = new Map();
floorMap.set(1, floorTexture);
floorMap.set(2, grassTexture);

function createPersonVertices(x, y) {
    return {
        positions: [
            x, 0, y,
            x + 1, 0, y,
            x, 1, y,
            x + 1, 1, y
        ],
        textureCoordinates: [
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ],
        indices: [
            0, 1, 2,
            2, 1, 3
        ]
    };
}

function createBuffersForPerson(gl, x, y) {
    const personData = createPersonVertices(x, y);
    const personPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, personPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(personData.positions), gl.STATIC_DRAW);

    const personTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, personTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(personData.textureCoordinates), gl.STATIC_DRAW);

    const personIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, personIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(personData.indices), gl.STATIC_DRAW);

    return {
        position: personPositionBuffer,
        textureCoord: personTextureCoordBuffer,
        indices: personIndexBuffer,
        vertexCount: personData.indices.length,
    };
}

// Drawing function for a person
function drawPerson(gl, programInfo, buffer, modelViewMatrix) {
    const uColorLocation = gl.getUniformLocation(programInfo.program, "uColor");

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, personTexture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    gl.uniform4f(uColorLocation, 0.0, 0.0, 0.0, 0.0); // No color for person

    gl.drawElements(gl.TRIANGLES, buffer.vertexCount, gl.UNSIGNED_SHORT, 0);
}

// Function to create sphere vertices and indices
function createSphere(radius, latitudeBands, longitudeBands) {
    const positions = [];
    const indices = [];

    for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
        const theta = latNumber * Math.PI / latitudeBands;
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
            const phi = longNumber * 2 * Math.PI / longitudeBands;
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const x = cosPhi * sinTheta;
            const y = cosTheta;
            const z = sinPhi * sinTheta;

            positions.push(radius * x, radius * y, radius * z);
        }
    }

    for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
            const first = (latNumber * (longitudeBands + 1)) + longNumber;
            const second = first + longitudeBands + 1;
            indices.push(first, second, first + 1, second, second + 1, first + 1);
        }
    }

    return { positions, indices };
}

// Add the sphere geometry to the buffers
const sphereData = createSphere(0.25, 30, 30); // Radius 0.5, 30 latitude and longitude bands
const spherePositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, spherePositionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereData.positions), gl.STATIC_DRAW);

const sphereIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereData.indices), gl.STATIC_DRAW);

const sphereBuffer = {
    position: spherePositionBuffer,
    indices: sphereIndexBuffer,
    vertexCount: sphereData.indices.length,
};

// Drawing function for the sphere
function drawSphere(gl, programInfo, buffer, modelViewMatrix, color) {
    const uColorLocation = gl.getUniformLocation(programInfo.program, "uColor");

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);
    gl.uniform4fv(uColorLocation, color);

    gl.drawElements(gl.TRIANGLES, buffer.vertexCount, gl.UNSIGNED_SHORT, 0);
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const vsSource = `
attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;

void main(void) {
gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
vTextureCoord = aTextureCoord;
vFragPos = (uModelViewMatrix * aVertexPosition).xyz;
}
`;

// Add a new fragment shader to handle color
const fsSourceColored = `
varying highp vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform highp vec3 fogColor;
uniform highp float fogNear;
uniform highp float fogFar;
varying highp vec3 vFragPos;
uniform highp vec4 uColor;

void main(void) {
    if (uColor.a != 0.0) {
        gl_FragColor = uColor;
    } else {
        highp vec4 textureColor = texture2D(uSampler, vTextureCoord);
        highp float fogDistance = length(vFragPos);
        highp float fogFactor = smoothstep(fogNear, fogFar, fogDistance);
        gl_FragColor = mix(textureColor, vec4(fogColor, 1.0), fogFactor);
        gl_FragColor.a *= textureColor.a;  // Apply texture alpha
    }
}
`;

const shaderProgram = initShaderProgram(gl, vsSource, fsSourceColored);

const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        fogColor: gl.getUniformLocation(shaderProgram, 'fogColor'),
        fogNear: gl.getUniformLocation(shaderProgram, 'fogNear'),
        fogFar: gl.getUniformLocation(shaderProgram, 'fogFar'),
        uColor: gl.getUniformLocation(shaderProgram, "uColor")
    },
};

let buffers = initBuffers(gl);

function initBuffers(gl) {
    const positions = [];
    const textureCoordinates = [];
    const indices = [];
    const floorPositions = [];
    const floorTextureCoordinates = [];
    const floorIndices = [];

    let vertexIndex = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 1) {
                // South side (facing camera)
                positions.push(
                    x, 0, y,
                    x + 1, 0, y,
                    x, 1, y,
                    x + 1, 1, y
                );
                textureCoordinates.push(
                    0, 0,
                    1, 0,
                    0, 1,
                    1, 1
                );
                indices.push(
                    vertexIndex, vertexIndex + 1, vertexIndex + 2,
                    vertexIndex + 2, vertexIndex + 1, vertexIndex + 3
                );
                vertexIndex += 4;

                // North side
                positions.push(
                    x, 0, y + 1,
                    x + 1, 0, y + 1,
                    x, 1, y + 1,
                    x + 1, 1, y + 1
                );
                textureCoordinates.push(
                    0, 0,
                    1, 0,
                    0, 1,
                    1, 1
                );
                indices.push(
                    vertexIndex, vertexIndex + 1, vertexIndex + 2,
                    vertexIndex + 2, vertexIndex + 1, vertexIndex + 3
                );
                vertexIndex += 4;

                // East side
                positions.push(
                    x + 1, 0, y,
                    x + 1, 0, y + 1,
                    x + 1, 1, y,
                    x + 1, 1, y + 1
                );
                textureCoordinates.push(
                    0, 0,
                    1, 0,
                    0, 1,
                    1, 1
                );
                indices.push(
                    vertexIndex, vertexIndex + 1, vertexIndex + 2,
                    vertexIndex + 2, vertexIndex + 1, vertexIndex + 3
                );
                vertexIndex += 4;

                // West side
                positions.push(
                    x, 0, y,
                    x, 0, y + 1,
                    x, 1, y,
                    x, 1, y + 1
                );
                textureCoordinates.push(
                    0, 0,
                    1, 0,
                    0, 1,
                    1, 1
                );
                indices.push(
                    vertexIndex, vertexIndex + 1, vertexIndex + 2,
                    vertexIndex + 2, vertexIndex + 1, vertexIndex + 3
                );
                vertexIndex += 4;
            }
        }
    }

    // Floor vertices
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            floorPositions.push(
                x, 0, y,
                x + 1, 0, y,
                x, 0, y + 1,
                x + 1, 0, y + 1
            );
            floorTextureCoordinates.push(
                0, 0,
                1, 0,
                0, 1,
                1, 1
            );
            floorIndices.push(
                vertexIndex, vertexIndex + 1, vertexIndex + 2,
                vertexIndex + 2, vertexIndex + 1, vertexIndex + 3
            );
            vertexIndex += 4;
        }
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions.concat(floorPositions)), gl.STATIC_DRAW);

    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates.concat(floorTextureCoordinates)), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices.concat(floorIndices)), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
        vertexCount: indices.length + floorIndices.length,
        wallVertexCount: indices.length,
        floorVertexCount: floorIndices.length,
    };
}

function buildTexture(gl, width, height, tumbler) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const data = tumbler.getData();

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    return texture;
}

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

// Update the drawScene function to draw the sphere
// Update the drawScene function to draw the sphere and person
function drawScene(gl, programInfo, buffers, wallTexture, floorTexture, sphereBuffer) {
    gl.clearColor(0.53, 0.81, 0.98, 1.0); // Set the clear color to sky blue
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [-cameraX - 0.5, -1.0, -cameraY]);

    // Set up buffers and draw walls and floor
    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

    // Set fog uniforms
    gl.uniform3f(programInfo.uniformLocations.fogColor, 0.53, 0.81, 0.98); // Fog color
    gl.uniform1f(programInfo.uniformLocations.fogNear, 1.0); // Start of fog
    gl.uniform1f(programInfo.uniformLocations.fogFar, 10.0); // End of fog

    // Draw walls
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, wallTexture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    gl.uniform4f(programInfo.uniformLocations.uColor, 0.0, 0.0, 0.0, 0.0); // No color for walls and floor
    {
        const vertexCount = buffers.wallVertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Draw floor
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
    {
        const vertexCount = buffers.floorVertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = buffers.wallVertexCount * 2;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Draw the sphere above the floor
    const sphereModelViewMatrix = mat4.create();
    sphereOffsets = computeSphereOffsets(cameraX, cameraY, sphereMapX, sphereMapY);
    mat4.translate(sphereModelViewMatrix, sphereModelViewMatrix, sphereOffsets);
    drawSphere(gl, programInfo, sphereBuffer, sphereModelViewMatrix, [0.0, 1.0, 0.0, 1.0]);

    // Draw persons
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 3) {
                const personBuffers = createBuffersForPerson(gl, x, y);
                drawPerson(gl, programInfo, personBuffers, modelViewMatrix);
            }
        }
    }
}

function findSpherePosition() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 2) {
                return { x: x, y: y };
            }
        }
    }
}

// Function to redraw the scene with a new map
function redrawScene(newMap) {
    switch (level) {
        case 1: {
            wallTexture = buildTexture(gl, 256, 256, tumblerWall1);
            break;
        }
        case 2: {
            wallTexture = buildTexture(gl, 256, 256, tumblerWall2);
            break;
        }
    }
    map = newMap;
    buffers = initBuffers(gl);
    // Example usage: move the sphere to a new location on the map
    const { x, y } = findSpherePosition();
    moveSphere(x, y);
    drawScene(gl, programInfo, buffers, wallTexture, floorMap.get(level), sphereBuffer);
}

document.addEventListener('keydown', (event) => {
    if (lives <= 0) {
        return;
    }
    if (!playingAudio) {
        playingAudio = true;
        playSounds();
    }
    const randomNum = Math.floor(Math.random() * 2) + 1;
    if (event.key === 'ArrowUp' && (map[cameraY - 1][cameraX] === 0 || map[cameraY - 1][cameraX] === 2)) {
        cameraY--;
    } else if (event.key === 'ArrowDown' && (map[cameraY + 1][cameraX] === 0 || map[cameraY + 1][cameraX] === 2)) {
        cameraY++;
    } else if (event.key === 'ArrowLeft' && (map[cameraY][cameraX - 1] === 0 || map[cameraY][cameraX - 1] === 2)) {
        cameraX--;
    } else if (event.key === 'ArrowRight' && (map[cameraY][cameraX + 1] === 0 || map[cameraY][cameraX + 1] === 2)) {
        cameraX++;
    } else if (map[cameraY - 1][cameraX] === 3) {
        if (event.key === 'a') {
            switch (randomNum) {
                // Rock
                case 1: {
                    map[cameraY - 1][cameraX] = 0;
                    victories++;
                    showStatus('win', 'Scissors')
                    break;
                }
                case 2: {
                    lives--;
                    showStatus('defeat', 'Paper');
                    break;
                }
            }
        } else if (event.key === 's') {
            switch (randomNum) {
                // Paper
                case 1: {
                    map[cameraY - 1][cameraX] = 0;
                    victories++;
                    showStatus('win', 'Rock')
                    break;
                }
                case 2: {
                    lives--;
                    showStatus('defeat', 'Scissors');
                    break;
                }
            }
        } else if (event.key === 'd') {
            switch (randomNum) {
                // Scissors
                case 1: {
                    map[cameraY - 1][cameraX] = 0;
                    victories++;
                    showStatus('win', 'Paper')
                    break;
                }
                case 2: {
                    lives--;
                    showStatus('defeat', 'Rock')
                    break;
                }
            }
        }
    }
    if (map[cameraY][cameraX] === 2) {
        const newLevel = sphereTargetMap.get(level);
        level = newLevel;
        redrawScene(maps[String(level)]);
    } else {
        drawScene(gl, programInfo, buffers, wallTexture, floorMap.get(level), sphereBuffer);
    }
});

let isFullScreen = false;

function drawLives() {
    const status = document.getElementById('status');
    if (lives <= 0) {
        playingAudio = false;
        status.innerText = 'You lost!'
    } else if (victories === 2) {
        status.innerText = 'You won!'
    } else {
        status.innerText = 'Lives: ' + lives;
    }
    const btn = document.createElement('button');
    btn.innerText = 'Manual';
    btn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    btn.onclick = () => {
        const d = document.getElementById('overlay');
        if (d.hidden) {
            d.removeAttribute('hidden');
        } else {
            d.setAttribute('hidden', true);
        }
    }
    status.appendChild(btn);
    const leftBtn = document.createElement('button');
    leftBtn.innerText = 'Left';
    leftBtn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    leftBtn.onclick = () => {
        let event = new KeyboardEvent('keydown', {
            key: 'ArrowLeft'
        });
        document.dispatchEvent(event);
    }
    status.appendChild(leftBtn);
    const upBtn = document.createElement('button');
    upBtn.innerText = 'Up';
    upBtn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    upBtn.onclick = () => {
        let event = new KeyboardEvent('keydown', {
            key: 'ArrowUp'
        });
        document.dispatchEvent(event);
    }
    status.appendChild(upBtn);
    const rightBtn = document.createElement('button');
    rightBtn.innerText = 'Right';
    rightBtn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    rightBtn.onclick = () => {
        let event = new KeyboardEvent('keydown', {
            key: 'ArrowRight'
        });
        document.dispatchEvent(event);
    }
    status.appendChild(rightBtn);
    const backBtn = document.createElement('button');
    backBtn.innerText = 'Back';
    backBtn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    backBtn.onclick = () => {
        let event = new KeyboardEvent('keydown', {
            key: 'ArrowDown'
        });
        document.dispatchEvent(event);
    }
    status.appendChild(backBtn);
    const rBtn = document.createElement('button');
    rBtn.innerText = 'Rock';
    rBtn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    rBtn.onclick = () => {
        let event = new KeyboardEvent('keydown', {
            key: 'a'
        });
        document.dispatchEvent(event);
    }
    status.appendChild(rBtn);
    const pBtn = document.createElement('button');
    pBtn.innerText = 'Paper';
    pBtn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    pBtn.onclick = () => {
        let event = new KeyboardEvent('keydown', {
            key: 's'
        });
        document.dispatchEvent(event);
    }
    status.appendChild(pBtn);
    const sBtn = document.createElement('button');
    sBtn.innerText = 'Scissors';
    sBtn.style = 'color:white;background-color:#2222;margin-left:1rem;'
    sBtn.onclick = () => {
        let event = new KeyboardEvent('keydown', {
            key: 'd'
        });
        document.dispatchEvent(event);
    }
    status.appendChild(sBtn);
    const fullScreenBtn = document.createElement('button');
    fullScreenBtn.innerText = 'Full Screen';
    fullScreenBtn.style = 'color:white;background-color:#2222;margin-left:1rem;';
    const fullScreenToggleFn = () => {
        if (!isFullScreen) {
            canvas.style.width = '100%';
            canvas.style.height = 'calc(100% - 30px)'
            isFullScreen = true;
        } else {
            canvas.style.width = '';
            canvas.style.height = ''
            isFullScreen = false;
        }
    };
    fullScreenBtn.onclick = fullScreenToggleFn;
    status.appendChild(fullScreenBtn);
}

let rpsResultTimeout;
let rpsResultEle;

function computeColor(hidden) {
    if (!hidden) {
        // Get the current value of the CSS variable
        let currentIntensity = getComputedStyle(document.documentElement).getPropertyValue('--intensity').trim();
        let newIntensity = Math.max(parseInt(currentIntensity) - 30, 135);
        // Set the new value back to the CSS variable
        document.documentElement.style.setProperty('--intensity', newIntensity);
    } else {
        document.documentElement.style.setProperty('--intensity', 255);
    }
}

function showStatus(id, txt) {
    const ele = document.getElementById(id);
    computeColor(ele.hidden);
    ele.removeAttribute('hidden');
    ele.innerText = txt;

    if (rpsResultTimeout) {
        if (rpsResultEle !== ele) {
            rpsResultEle.setAttribute('hidden', true);
        }
        clearTimeout(rpsResultTimeout);
    }
    rpsResultTimeout = setTimeout(() => {
        ele.setAttribute('hidden', true);
    }, 3000);
    rpsResultEle = ele;

    drawLives();
}

function playSounds() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    const notes = [
        { frequency: 440, duration: 1, position: { x: 1, y: 0, z: 0 } },  // A4, whole note
        { frequency: 494, duration: 0.5, position: { x: -1, y: 0, z: 0 } }, // B4, half note
        { frequency: 523, duration: 0.25, position: { x: 0, y: 0, z: 1 } },  // C5, quarter note
        { frequency: 392, duration: 0.25, position: { x: 0, y: 0, z: -1 } }, // G4, quarter note
        { frequency: 659, duration: 0.5, position: { x: 1, y: 0, z: 1 } },  // E5, half note
        { frequency: 698, duration: 0.25, position: { x: -1, y: 0, z: 1 } }, // F5, quarter note
        { frequency: 330, duration: 0.25, position: { x: 1, y: 0, z: -1 } }, // E4, quarter note
        { frequency: 349, duration: 1, position: { x: 0, y: 1, z: 0 } },  // F4, whole note
        { frequency: 311, duration: 0.5, position: { x: 0, y: -1, z: 0 } }, // D#4, half note
        { frequency: 587, duration: 0.25, position: { x: 1, y: 1, z: 0 } },  // D5, quarter note
        { frequency: 261, duration: 0.25, position: { x: -1, y: -1, z: 0 } }, // C4, quarter note
        { frequency: 349, duration: 0.5, position: { x: 0, y: 1, z: 1 } },  // F4, half note
        { frequency: 440, duration: 0.25, position: { x: 0, y: -1, z: 1 } }, // A4, quarter note
        { frequency: 493, duration: 0.25, position: { x: 1, y: -1, z: 0 } }, // B4, quarter note
        { frequency: 523, duration: 1, position: { x: -1, y: 1, z: 0 } }, // C5, whole note
        { frequency: 294, duration: 0.25, position: { x: 1, y: 0, z: -1 } }, // D4, quarter note
        { frequency: 329, duration: 0.25, position: { x: -1, y: 0, z: -1 } }, // E4, quarter note
        { frequency: 370, duration: 0.5, position: { x: 0, y: 0, z: 2 } },  // F#4, half note
        { frequency: 415, duration: 0.25, position: { x: 0, y: 0, z: -2 } }, // G#4, quarter note
        { frequency: 466, duration: 0.25, position: { x: 1, y: 1, z: 1 } },  // A#4, quarter note
        { frequency: 523, duration: 0.5, position: { x: -1, y: 1, z: -1 } }, // C5, half note
        { frequency: 587, duration: 0.25, position: { x: 1, y: -1, z: 1 } },  // D5, quarter note
        { frequency: 659, duration: 0.25, position: { x: -1, y: -1, z: 1 } }, // E5, quarter note
        { frequency: 698, duration: 1, position: { x: 1, y: 0, z: 2 } },  // F5, whole note
    ];

    let delay = 0;
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        playSound(audioContext, note.frequency, note.duration, note.position, delay);
        delay += note.duration;
    }

    // Schedule the next playSounds call
    if (playingAudio) {
        setTimeout(playSounds, delay * 1000); // delay is in seconds, convert to milliseconds
    }
}

function playSound(audioContext, frequency, duration, position, delay) {
    if (!playingAudio) {
        return;
    }

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // You can change this to 'square', 'sawtooth', 'triangle'
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime + delay); // Lower volume for distance effect

    const panner = new PannerNode(audioContext, {
        panningModel: 'HRTF',
        distanceModel: 'inverse',
        positionX: position.x,
        positionY: position.y,
        positionZ: position.z,
        refDistance: 1,    // Reference distance for volume reduction
        maxDistance: 10,   // Maximum distance for the sound
        rolloffFactor: 2   // How quickly the volume reduces with distance
    });

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime + delay); // Low-pass filter frequency

    oscillator.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(panner);
    panner.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + duration);
}

drawLives();
drawScene(gl, programInfo, buffers, wallTexture, floorMap.get(level), sphereBuffer);
