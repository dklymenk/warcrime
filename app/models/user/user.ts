import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { v4 as uuidv4 } from "uuid"
import "react-native-get-random-values"

/**
 * Model description here for TypeScript hints.
 */
export const UserModel = types
  .model("User")
  .props({ id: uuidv4() })
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

type UserType = Instance<typeof UserModel>
export interface User extends UserType {}
type UserSnapshotType = SnapshotOut<typeof UserModel>
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserModel, {})
