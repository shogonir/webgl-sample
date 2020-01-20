import ComplexNumber from './ComplexNumber'

export default class MandelbrotSet {

  static willConverge(c: ComplexNumber, iteration: number): number {
    let z = new ComplexNumber(0, 0)
    for (let index = 0; index < iteration; index++) {
      z = z.multiply(z).add(c)
      if (z.abs() > 2) {
        return index / iteration
      }
    }
    return 1.0
  }

  static draw(canvas: HTMLCanvasElement, iteration: number) {
    const mayBeContext: CanvasRenderingContext2D | null = canvas.getContext('2d')
    if (mayBeContext === null) {
      console.log(`could not get context`)
      return
    }

    const context: CanvasRenderingContext2D = mayBeContext
    const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data: Uint8ClampedArray = imageData.data

    const max = 2
    const min = -2
    let pixelIndex = 0
    for (let y = max; y > min; y -= (max - min) / canvas.height) {
      for (let x = min; x < max; x += (max - min) / canvas.width) {
        const z = new ComplexNumber(x, y)
        const willConverge = MandelbrotSet.willConverge(z, iteration)
        data[pixelIndex * 4 + 0] = 255 * willConverge  // r
        data[pixelIndex * 4 + 1] = 255 * willConverge  // g
        data[pixelIndex * 4 + 2] = 255 * willConverge  // b
        data[pixelIndex * 4 + 3] = 255  // a
        pixelIndex++;
      }
    }

    context.putImageData(imageData, 0, 0)
  }
}