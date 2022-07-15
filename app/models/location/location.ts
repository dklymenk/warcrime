import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Model description here for TypeScript hints.
 */
export const LocationModel = types
  .model("Location")
  .props({
    latLong: types.optional(types.string, ""),
    updatedAt: types.optional(types.string, ""),
  })
  .views((_self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    update({ latLong }: { latLong: string }) {
      if (latLong === self.latLong) {
        return
      }
      self.latLong = latLong
      self.updatedAt = new Date().toISOString()
    },
  }))

type LocationType = Instance<typeof LocationModel>
export interface Location extends LocationType {}
type LocationSnapshotType = SnapshotOut<typeof LocationModel>
export interface LocationSnapshot extends LocationSnapshotType {}
export const createLocationDefaultModel = () => types.optional(LocationModel, {})
