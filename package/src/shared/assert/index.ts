export default (condition: any, message?: string) => {
  if (!condition) throw new Error(message || `assertion did not passed successfuly`)
}