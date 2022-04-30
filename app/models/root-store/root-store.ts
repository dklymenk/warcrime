import { getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { CharacterStoreModel } from "../character-store/character-store"
import { ReportStoreModel } from "../report-store/report-store"
import { UserModel } from "../user/user"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  characterStore: types.optional(CharacterStoreModel, {} as any),
  reportStore: types.optional(ReportStoreModel, {} as any),
  user: types.optional(UserModel, getSnapshot(UserModel.create())),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
