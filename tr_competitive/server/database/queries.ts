type SQLValue = string | number | boolean | null

export const getSingleRow = async <T extends Record<string, unknown>>(columns: string, table: string, conditions?: string, ...values: SQLValue[]): Promise<T | null> => await exports.oxmysql.single_async(
  `SELECT ${columns} FROM ${table}${conditions ? ` WHERE ${conditions}` : ''}`
, values)

export const getSingleColumn = async <T extends Record<string, unknown>>(column: string, table: string, conditions?: string, ...values: SQLValue[]): Promise<Array<T>> => await exports.oxmysql.executeSync(
  `SELECT ${column} FROM ${table}${conditions ? ` WHERE ${conditions}` : ''}`
, values)

export const updateRow = async (table: string, column: string, conditions?: string, ...values: SQLValue[]): Promise<number> => await exports.oxmysql.update_async(
  `UPDATE ${table} SET ${column} = ?${conditions ? ` WHERE ${conditions}` : ''}`
, values)

export const insertNewRow = async (table: string, columns: string, placeholders: string, ...values: SQLValue[]): Promise<number> => await exports.oxmysql.insert_async(
  `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
, values)