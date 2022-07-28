import LPromise from '../index'

describe('base', () => {
  it('resolve.then', () => {
    const lp1 = new LPromise((resolve, reject) => {
      resolve(3)
    })

    lp1.then(res => {
      expect(res).toBe(3)
    })
  })

  it('reject.then', () => {
    const lp1 = new LPromise((resolve, reject) => {
      reject('error')
    })

    lp1.catch(res => {
      expect(res).toBe('error')
    })
  })
})