import color from "colors"

export const log = (title: string, data: unknown, showLogs = true) => {
  if (!showLogs) return

  console.log()
  console.log(color.bold(`******* ${title} *******`))
  console.log(data)
  console.log(color.bold("************************************"))
  console.log()
}
type TableCell = string | number | boolean | null | undefined

interface DataRow {
  [key: string]: TableCell
}

export type DataTable = {
  addRow: (row: DataRow) => void
  removeRow: (index: number) => void
  updateCellValue: (rowIndex: number, columnName: string, value: TableCell) => void
  clearTable: () => void
  printTable: () => void
}

export const createDataTable = (headers: string[]): DataTable => {
  let tableData: DataRow[] = []

  // Add a row to the table data
  function addRow(row: DataRow) {
    tableData.push(row)
  }

  // Remove a row from the table data at the specified index
  function removeRow(index: number) {
    tableData.splice(index, 1)
  }

  // Update the value of a cell in the table data at the specified row and column index
  function updateCellValue(rowIndex: number, columnName: string, value: TableCell) {
    const row = tableData[rowIndex]
    if (row) {
      row[columnName] = value
    }
  }

  // Clear all rows from the table data
  function clearTable() {
    tableData = []
  }

  // Print the table data using console.table
  function printTable() {
    console.table(tableData, headers)
  }

  // Return an object with the available functions
  return {
    addRow,
    removeRow,
    updateCellValue,
    clearTable,
    printTable,
  }
}
