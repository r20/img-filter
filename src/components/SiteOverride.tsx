import React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import MatchTypeSelect from "./MatchTypeSelect";

import { FilterLevel, MatchType, ISiteOverride } from "../types";

interface IProps {
  siteOverride: ISiteOverride;
  setSiteOverride: (newSiteOverride: ISiteOverride) => void;
  onRemoveSiteOverride: (siteOverride: ISiteOverride) => void;
}
/* These setting apply to all sites that don't have site specific settings */
const SiteOverride = ({ siteOverride, setSiteOverride, onRemoveSiteOverride }: IProps) => {
  console.log("jmr - rendering SiteOverride", siteOverride.idx);

  const handleImgLevelChange = (event: React.MouseEvent<HTMLElement>, val: FilterLevel) => {
    setSiteOverride({ ...siteOverride, imgLevel: val });
  };
  const handleIframeLevelChange = (event: React.MouseEvent<HTMLElement>, val: FilterLevel) => {
    setSiteOverride({ ...siteOverride, iframeLevel: val });
  };

  const handleMatchTypeSelection = (val: MatchType) => {
    setSiteOverride({ ...siteOverride, matchType: val });
  };

  const handleMatchStringChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setSiteOverride({ ...siteOverride, matchString: val });
  };

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={2.5}>
        <MatchTypeSelect
          idPrefix={String(siteOverride.idx)}
          selectedValue={siteOverride.matchType}
          onSelection={handleMatchTypeSelection}
        />
      </Grid>
      <Grid item xs={4.5}>
        <TextField
          id={`matchString-${siteOverride.idx}`}
          label="Web Address Substring"
          value={siteOverride.matchString}
          onChange={handleMatchStringChange}
          size="small"
          fullWidth
        />
      </Grid>
      <Grid item xs={4} container spacing={0.5} alignItems="center">
        <Grid item xs={3.5}>
          <Typography variant="body2">images</Typography>
        </Grid>
        <Grid item xs={8.5}>
          <ToggleButtonGroup
            size="small"
            color="primary"
            value={siteOverride.imgLevel}
            exclusive
            onChange={handleImgLevelChange}
            aria-label="Site-specific Image Filter Level"
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
            value={siteOverride.iframeLevel}
            exclusive
            onChange={handleIframeLevelChange}
            aria-label="Site-specific Iframe Filter Level"
          >
            <ToggleButton value={FilterLevel.None}>No</ToggleButton>
            <ToggleButton value={FilterLevel.Low}>Lo</ToggleButton>
            <ToggleButton value={FilterLevel.Medium}>Med</ToggleButton>
            <ToggleButton value={FilterLevel.High}>Hi</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Grid item xs={1}>
        <IconButton onClick={() => onRemoveSiteOverride(siteOverride)}>
          <CloseIcon
            sx={{
              color: "error.main",
              "&:hover": {
                color: "error.dark",
              },
            }}
          />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default React.memo(SiteOverride);
