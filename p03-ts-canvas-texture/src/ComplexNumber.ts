export default class ComplexNumber {

  real: number
  imag: number

  constructor(real: number, imaginary: number) {
    this.real = real
    this.imag = imaginary
  }

  re(): number {
    return this.real
  }

  im(): number {
    return this.imag
  }

  abs(): number {
    return Math.sqrt(this.real ** 2 + this.imag ** 2)
  }

  add(z: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.re() + z.re(), this.im() + z.im())
  }

  subtract(z: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.re() - z.re(), this.im() - z.im())
  }

  multiply(z: ComplexNumber): ComplexNumber {
    return new ComplexNumber(this.re() * z.re() - this.im() * z.im(), this.im() * z.re() + this.re() * z.im())
  }

  divide(z: ComplexNumber): ComplexNumber {
    const re: number = (this.re() * z.re() + this.im() * z.im()) / (z.re() ** 2 + z.im() ** 2)
    const im: number = (this.im() * z.re() - this.re() * z.im()) / (z.re() ** 2 + z.im() ** 2)
    return new ComplexNumber(re, im)
  }
}