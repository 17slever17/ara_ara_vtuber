export const calcTotalCount = (items: Record<string, number>) => {
  return Object.values(items).reduce((sum, count) => sum + count, 0)
}
