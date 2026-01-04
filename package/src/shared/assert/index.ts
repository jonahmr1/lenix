export default (condition: any, errorMessage?: string): void | never => {
  if (!condition) throw new Error(errorMessage || `assertion did not passed successfuly`)
}