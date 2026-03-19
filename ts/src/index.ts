export { wait } from '~/wait'
export { safeRequest } from '~/fetch'

const obj = {
  name: "lenix",
  age: 20
}


const ent = Object.entries(obj)

ent.map((v, k) => {
  console.log(v, k)
})