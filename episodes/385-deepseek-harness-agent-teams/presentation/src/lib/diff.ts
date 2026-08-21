/** Indices in `next` that are not part of the longest common subsequence with `prev`. */
export function addedLines(prev: readonly string[], next: readonly string[]): Set<number> {
  const n = prev.length
  const m = next.length
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      table[i][j] = prev[i] === next[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  const added = new Set<number>()
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (prev[i] === next[j]) {
      i += 1
      j += 1
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      i += 1
    } else {
      added.add(j)
      j += 1
    }
  }
  while (j < m) {
    added.add(j)
    j += 1
  }
  return added
}
