// require('environment')
// Some top level globals
const WIDTH = 960 * 0.8;
const HEIGHT = 540 * 0.8;

// Load glsl from text
let vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main() {',
    '  fragColor = vertColor;',
    '  gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
].join('\n');

let fragShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main() {',
    '  gl_FragColor = vec4(fragColor, 1.0);',
    '}'
].join('\n');

let war = (state, error_msg = 'none', ...restProps) => {
    if (restProps === '') { restProps = ' ' }
    console.error('EXCEPTION: ', error_msg, ' (', state, ')\n',
		  restProps.join('\n'));
    return state;
}

// Demo
let init_demo = () => { 
    console.log('JS complete initialization');
    
    let canvas = document.getElementById('demo-canv');
    let gl = canvas.getContext('webgl');

    if (!gl) {
	war(1, 'WebGL not supported, falling back on experimental-brach');
	gl = canvas.getContext(experimental-webgl);
    }
    if (!gl) {
	return(2);
    } else {
	return [0, gl, canvas];
    }
}

let run_demo = () => {
    // Initialize
    let [state, gl, canvas] = init_demo();
    
    if (state === 2) {
	return war(state, 'WebGL not supported');;
    }
    
    console.log('WebGL complete initialization');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.7, 0.75, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);

    // TODO: Move Load Shaders (from file) down here

    // Compiling primitive's shaders
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragShader, fragShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
	return war(10, 'Unable to compile vetex shader', 'vertex_shader.webgl: ' +
		   gl.getShaderInfoLog(vertexShader));
	
    }
    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
	return war(11, 'Unable to compile fragment shader', 'frag_shader.webgl: ' +
		   gl.getShaderInfoLog(fragShader));
    }

    // Link webgl program
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	return war(20, 'Unable to link webgl program', gl.getProgramInfoLog(program));
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	return war(30, 'Unable to validation', gl.getProgramInfoLog(program));
    }

    // Create buffer
    let triangleVertices = [
	//X, Y,     R, G, B
	0.0, 0.5,   1.0, 1.0, 0.0,
	-0.5, -0.5, 0.7, 0.0, 1.0,
	0.5, -0.5,  0.1, 1.0, 0.6
    ];

    let triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    // Set the webgl program attribute data inline
    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
	positionAttribLocation, // Attribute location
	2,                      // Number of elements of attribute
	gl.FLOAT,               // Type of elements
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertex
	0                       // Offset from the beggining of a single vertex
				// to this attribute
    );
    gl.vertexAttribPointer(
	colorAttribLocation,
	3,
	gl.FLOAT,
	gl.FALSE,
	5 * Float32Array.BYTES_PER_ELEMENT,
	2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // Main render loop (usually run by render parallel method)
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
