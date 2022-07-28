import LPromise from '../index'

describe('base', () => {
  it('.all -- error', () => {
    const p1 = new LPromise((resolve) => {
      setTimeout(() => {
        resolve(99)
      }, 100)
    })

    const p2 = new LPromise((resolve, reject) => {
      setTimeout(() => {
        reject('发生错误')
      }, 120)
    })

    LPromise.all([p1, p2]).then(res => {
      console.log('from all', res)
    }, err => {
      expect(err).toBe('发生错误')
    })
  })

  it('.all -- succ', () => {
    const p1 = new LPromise((resolve) => {
      setTimeout(() => {
        resolve(11)
      }, 100)
    })
    const p2 = new LPromise((resolve) => {
      setTimeout(() => {
        resolve(22)
      }, 40)
    })
    const p3 = new LPromise((resolve) => {
      setTimeout(() => {
        resolve(33)
      }, 50)
    })

    LPromise.all([p1, p2, p3]).then(res => {
      expect(res[0]).toBe(11)
      expect(res[1]).toBe(22)
      expect(res[2]).toBe(33)
    })
  })
})