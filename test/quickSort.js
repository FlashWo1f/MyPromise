const swap = (arr, i, j) => {
  if (i === j) return;
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

const quickSort = (data, left = 0, right = data.length - 1) => {
  if (left < right) {
    const pivot = right
    const partIndx = partition(data, pivot, left, right)
    quickSort(data, left, (left > partIndx - 1) ? left : partIndx - 1)
    quickSort(data, (right < partIndx + 1) ? right : partIndx + 1, right)
  }
}

const partition = (data, pivot, left, right) => {
  const pValue = data[pivot]
  let curIndex = left
  for (let i = left; i <= right; i++) {
    if (data[i] < pValue) {
      swap(data, curIndex, i)
      curIndex++
    }
  }
  swap(data, curIndex, pivot)
  return curIndex
}

const testCase = [3, 1, 2, 4, 6, 7, 23, 12, 3, 5, 0, 6]

quickSort(testCase)

console.log('result: ', testCase)
