import vertexShaderSource from './shader/VertexShader.glsl'
import fragmentShaderSource from './shader/FragmentShader.glsl'

import MandelbrotSet from './MandelbrotSet'

const loadTextureImage: () => Promise<HTMLImageElement> = () => {
  const texture = new Image()
  return new Promise((resolve) => {
    texture.addEventListener('load', () => {
      resolve(texture)
    })

    const canvas = document.createElement('canvas')
    MandelbrotSet.draw(canvas, 100)
    texture.src = canvas.toDataURL()
  })
}

const main = async () => {

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

  const textureImage = await loadTextureImage()

  const texture = context.createTexture()
  context.bindTexture(context.TEXTURE_2D, texture)
  context.texImage2D(
    context.TEXTURE_2D,
    0,
    context.RGBA,
    context.RGBA,
    context.UNSIGNED_BYTE,
    textureImage
  )
  context.generateMipmap(context.TEXTURE_2D)

  const halfSide = 0.5
  const vertices = new Float32Array([
    -halfSide, halfSide, 0.0,
    0.0, 0.0,
    -halfSide, -halfSide, 0.0,
    0.0, 1.0,
    halfSide, halfSide, 0.0,
    1.0, 0.0,
    halfSide, -halfSide, 0.0,
    1.0, 1.0
  ])

  const indices = new Uint16Array([0, 1, 2, 1, 3, 2])

  const vertexBuffer = context.createBuffer()
  context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer)
  context.bufferData(context.ARRAY_BUFFER, vertices, context.STATIC_DRAW)
  context.bindBuffer(context.ARRAY_BUFFER, null)

  const indexBuffer = context.createBuffer()
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer)
  context.bufferData(context.ELEMENT_ARRAY_BUFFER, indices, context.STATIC_DRAW)
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, null)

  const vertexAttribLocation = context.getAttribLocation(program, 'vertexPosition')
  const textureAttribLocation  = context.getAttribLocation(program, 'texCoord')

  const VERTEX_SIZE    = 3
  const TEXTURE_SIZE   = 2
  const STRIDE         = (VERTEX_SIZE + TEXTURE_SIZE) * Float32Array.BYTES_PER_ELEMENT
  const VERTEX_OFFSET  = 0
  const TEXTURE_OFFSET = 3 * Float32Array.BYTES_PER_ELEMENT

  context.bindBuffer(context.ARRAY_BUFFER, vertexBuffer)

  context.enableVertexAttribArray(vertexAttribLocation)
  context.enableVertexAttribArray(textureAttribLocation)

  context.vertexAttribPointer(vertexAttribLocation, VERTEX_SIZE, context.FLOAT, false, STRIDE, VERTEX_OFFSET)
  context.vertexAttribPointer(textureAttribLocation, TEXTURE_SIZE, context.FLOAT, false, STRIDE, TEXTURE_OFFSET)

  const indexSize = indices.length
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, indexBuffer)
  context.drawElements(context.TRIANGLES, indexSize, context.UNSIGNED_SHORT, 0)
  context.flush()
}

main()