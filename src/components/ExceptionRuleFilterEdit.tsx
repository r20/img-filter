import React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { FilterLevel, IExceptionRule } from "../types";

interface IProps {
  exceptionRule: IExceptionRule;
  onImgLevelChange: (newVal: FilterLevel) => void;
  onIframeLevelChange: (newVal: FilterLevel) => void;
}

const ExceptionRuleFilterEdit = ({
  exceptionRule,
  onImgLevelChange,
  onIframeLevelChange,
}: IProps) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "5px",
        }}
      >
        <Typography variant="body2" width={50}>
          images
        </Typography>
        <ToggleButtonGroup
          size="small"
          color="primary"
          value={exceptionRule.imgLevel}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            val: FilterLevel
          ) => {
            if (val !== null) {
              // Check for null to force one to be selected
              onImgLevelChange(val);
            }
          }}
          aria-label="Exception Rule Image Filter Level"
        >
          <ToggleButton value={FilterLevel.None}>No</ToggleButton>
          <ToggleButton value={FilterLevel.Low}>Lo</ToggleButton>
          <ToggleButton value={FilterLevel.Medium}>Med</ToggleButton>
          <ToggleButton value={FilterLevel.High}>Hi</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "5px",
        }}
      >
        <Typography variant="body2" width={50}>
          iframes
        </Typography>

        <ToggleButtonGroup
          size="small"
          color="primary"
          value={exceptionRule.iframeLevel}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            val: FilterLevel
          ) => {
            if (val !== null) {
              // Check for null to force one to be selected
              onIframeLevelChange(val);
            }
          }}
          aria-label="Exception Rule Iframe Filter Level"
        >
          <ToggleButton value={FilterLevel.None}>No</ToggleButton>
          <ToggleButton value={FilterLevel.Low}>Lo</ToggleButton>
          <ToggleButton value={FilterLevel.Medium}>Med</ToggleButton>
          <ToggleButton value={FilterLevel.High}>Hi</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default ExceptionRuleFilterEdit;
