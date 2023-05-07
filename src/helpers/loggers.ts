import color from "colors"

export const log = (title: string, data: unknown) => {
  console.log()
  console.log(color.bold(`******* ${title} *******`))
  console.log(data)
  console.log(color.bold("************************************"))
  console.log()
}
