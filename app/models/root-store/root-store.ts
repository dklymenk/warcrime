import { getSnapshot, Instance, SnapshotOut, types } from "mobx-state-tree"
import { LocationModel } from "../location/location"
import { ReportStoreModel } from "../report-store/report-store"
import { UserModel } from "../user/user"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  reportStore: types.optional(ReportStoreModel, {} as any),
  user: types.optional(UserModel, getSnapshot(UserModel.create())),
  location: types.optional(LocationModel, getSnapshot(LocationModel.create())),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
