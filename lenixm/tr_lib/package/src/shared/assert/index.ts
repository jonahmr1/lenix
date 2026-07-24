export default (condition: any, errorMessage?: string): asserts condition => {
  if (!condition) throw new Error(errorMessage || `assertion did not passed successfuly`)
}