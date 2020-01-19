import vertexShaderSource from './shader/VertexShader.glsl'
import fragmentShaderSource from './shader/FragmentShader.glsl'

const main = () => {

  const mayBeCanvas = document.getElementById('canvas')
  if (mayBeCanvas === null) {
    console.warn('not found canvas element')
    return
  }

  const canvas: HTMLCanvasElement = mayBeCanvas as HTMLCanvasElement

  const mayBeContext = canvas.getContext('webgl2')
  if (mayBeContext === null) {
    console.warn('could not get context')
    return
  }

  const context: WebGL2RenderingContext = mayBeContext

  const vertexShader = context.createShader(context.VERTEX_SHADER)
  context.shaderSource(vertexShader, vertexShaderSource)
  context.compileShader(vertexShader)

  const vertexShaderCompileStatus = context.getShaderParameter(vertexShader, context.COMPILE_STATUS)
  if(!vertexShaderCompileStatus) {
    const info = context.getShaderInfoLog(vertexShader)
    console.warn(info)
    return
  }

  const fragmentShader = context.createShader(context.FRAGMENT_SHADER)
  context.shaderSource(fragmentShader, fragmentShaderSource)
  context.compileShader(fragmentShader)

  const fragmentShaderCompileStatus = context.getShaderParameter(fragmentShader, context.COMPILE_STATUS)
  if(!fragmentShaderCompileStatus) {
    const info = context.getShaderInfoLog(fragmentShader)
    console.warn(info)
    return
  }

  const program = context.createProgram()
  context.attachShader(program, vertexShader)
  context.attachShader(program, fragmentShader)
  context.linkProgram(program)

  const linkStatus = context.getProgramParameter(program, context.LINK_STATUS)
  if(!linkStatus) {
    const info = context.getProgramInfoLog(program)
    console.warn(info)
    return
  }

  context.useProgram(program)

  const vertexBuffer = context.createBuffer()
  const colorBuffer = context.createBuffer()

  const vertexAttribLocation = context.getAttribLocation(program, 'vertexPosition')
  const colorAttribLocation  = context.getAttribLocation(program, 'color')

  const VERTEX_SIZE = 3 // vec3
  const COLOR_SIZE  = 4 // vec4

  context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer)
  context.enableVertexAttribArray(vertexAttribLocation)
  context.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, context.FLOAT, false, 0, 0)

  context.bindBuffer(context.ARRAY_BUFFER, colorBuffer)
  context.enableVertexAttribArray(colorAttribLocation)
  context.vertexAttribPointer(colorAttribLocation, COLOR_SIZE, context.FLOAT, false, 0, 0)

  const halfSide = 0.5
  const vertices = new Float32Array([
    -halfSide, halfSide,  0.0,
    -halfSide, -halfSide, 0.0,
    halfSide,  halfSide,  0.0,
    -halfSide, -halfSide, 0.0,
    halfSide,  -halfSide, 0.0,
    halfSide,  halfSide,  0.0
  ])

  const colors = new Float32Array([
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ])

  context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer)
  context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW)

  context.bindBuffer(context.ARRAY_BUFFER, colorBuffer)
  context.bufferData(context.ARRAY_BUFFER, colors, context.STATIC_DRAW)

  const VERTEX_NUMS = 6
  context.drawArrays(context.TRIANGLES, 0, VERTEX_NUMS)

  context.flush()
}

main()