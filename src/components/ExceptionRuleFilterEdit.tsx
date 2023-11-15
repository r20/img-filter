import React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Grid from "@mui/material/Grid";
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
    <Grid item xs={4} container spacing={0.5} alignItems="center">
      <Grid item xs={3.5}>
        <Typography variant="body2">images</Typography>
      </Grid>
      <Grid item xs={8.5}>
        <ToggleButtonGroup
          size="small"
          color="primary"
          value={exceptionRule.imgLevel}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            val: FilterLevel
          ) => {
            onImgLevelChange(val);
          }}
          aria-label="Exception Rule Image Filter Level"
        >
          <ToggleButton value={FilterLevel.None}>No</ToggleButton>
          <ToggleButton value={FilterLevel.Low}>Lo</ToggleButton>
          <ToggleButton value={FilterLevel.Medium}>Med</ToggleButton>
          <ToggleButton value={FilterLevel.High}>Hi</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid item xs={3.5}>
        <Typography variant="body2">iframes</Typography>
      </Grid>
      <Grid item xs={8.5}>
        <ToggleButtonGroup
          size="small"
          color="primary"
          value={exceptionRule.iframeLevel}
          exclusive
          onChange={(
            event: React.MouseEvent<HTMLElement>,
            val: FilterLevel
          ) => {
            onIframeLevelChange(val);
          }}
          aria-label="Exception Rule Iframe Filter Level"
        >
          <ToggleButton value={FilterLevel.None}>No</ToggleButton>
          <ToggleButton value={FilterLevel.Low}>Lo</ToggleButton>
          <ToggleButton value={FilterLevel.Medium}>Med</ToggleButton>
          <ToggleButton value={FilterLevel.High}>Hi</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default ExceptionRuleFilterEdit;
