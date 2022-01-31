export function range(start: number, end: number): number[] {
  const nums: number[] = []
  for (let i = start; i < end; i++) nums.push(i)
  return nums
}