import LPromise from '../index'

describe('base', () => {
  it('执行报错', () => {
    const p1 = new LPromise((resolve, reject) => {
      throw new Error('error')
    })

    expect(p1.status).toBe('rejected')
  })

  it('resolve.then', () => {
    const lp1 = new LPromise((resolve, reject) => {
      resolve(3)
    })

    lp1.then(res => {
      expect(lp1.status).toBe('fulfilled')
      expect(res).toBe(3)
    })
  })

  it('reject.then', () => {
    const lp1 = new LPromise((resolve, reject) => {
      reject('error')
    })

    lp1.catch(res => {
      expect(res).toBe('error')
      expect(lp1.status).toBe('rejected')
    })
  })
})