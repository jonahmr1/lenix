export type Events = "users-management"
export interface CreateUser<Role> {
  identifier: string
  role: Role
  password: string
}
export interface UserAccount<Role, Label = unknown | string> {
  id: string
  identifier: string
  role: Role
  roleLabel: Label
}
export interface DeleteUser {
  identifier: string
}

/**
 * @private
 * DON NOT USE
 * @description
 * A proxy between client and server contexts that can provide a one source of truth instead of duplicating codes, lack of clearancy, race conditions, ...
 */