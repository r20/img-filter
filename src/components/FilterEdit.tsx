import React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import { FilterLevel } from "../types";

interface IProps {
  imgLevel: FilterLevel;
  iframeLevel: FilterLevel;
  onImgLevelChange: (newVal: FilterLevel) => void;
  onIframeLevelChange: (newVal: FilterLevel) => void;
}

/* This shows the image and iframe levels and allows editing */
const FilterEdit = ({
  imgLevel,
  iframeLevel,
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
          value={imgLevel}
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
          aria-label="Custom Rule Image Filter Level"
        >
          <ToggleButton value={FilterLevel.None}>Off</ToggleButton>
          <ToggleButton value={FilterLevel.Low}>Low</ToggleButton>
          <ToggleButton value={FilterLevel.Medium}>Med</ToggleButton>
          <ToggleButton value={FilterLevel.High}>High</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginTop: "2px",
          marginBottom: "2px",
        }}
      >
        <Typography variant="body2" width={50}>
          iframes
        </Typography>

        <ToggleButtonGroup
          size="small"
          color="primary"
          value={iframeLevel}
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
          aria-label="Custom Rule Iframe Filter Level"
        >
          <ToggleButton value={FilterLevel.None}>Off</ToggleButton>
          <ToggleButton value={FilterLevel.Low}>Low</ToggleButton>
          <ToggleButton value={FilterLevel.Medium}>Med</ToggleButton>
          <ToggleButton value={FilterLevel.High}>High</ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default FilterEdit;
