import * as React from "react"
import { storiesOf } from "@storybook/react-native"
import { StoryScreen, Story, UseCase } from "../../../storybook/views"
import { color } from "../../theme"
import { Report } from "./report"
import { ReportStatus } from "../../models"

storiesOf("Report", module)
  .addDecorator((fn) => <StoryScreen>{fn()}</StoryScreen>)
  .add("Style Presets", () => (
    <Story>
      <UseCase text="Primary" usage="The primary.">
        <Report
          style={{ backgroundColor: color.error }}
          report={{
            id: "id",
            photo: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
            description: null,
            status: ReportStatus.Pending,
          }}
        />
      </UseCase>
    </Story>
  ))
