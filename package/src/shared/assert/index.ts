export default (condition: any, message?: string): void | never => {
  if (!condition) throw new Error(message || `assertion did not passed successfuly`)
}