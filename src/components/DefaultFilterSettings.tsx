import React, { useEffect, useState } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import { FilterLevel, IStoredValues } from "../types";

interface IProps {
  disabled: boolean;
}

/* These setting apply to all sites that don't have exception rules */
const DefaultFilterSettings = ({ disabled }: IProps) => {
  const [generalImgLevel, setGeneralImgLevel] = useState<FilterLevel>(
    FilterLevel.Low
  );
  const [generalIframeLevel, setGeneralIframeLevel] = useState<FilterLevel>(
    FilterLevel.Medium
  );

  useEffect(() => {
    const defaults: IStoredValues = {
      generalImgLevel: FilterLevel.Low,
      generalIframeLevel: FilterLevel.Medium,
    };
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(defaults, (items) => {
      setGeneralImgLevel(items.generalImgLevel);
      setGeneralIframeLevel(items.generalIframeLevel);
    });
  }, []);

  const handleImgLevelChange = (
    event: React.MouseEvent<HTMLElement>,
    val: FilterLevel
  ) => {
    setGeneralImgLevel(val);
    const forStorage: IStoredValues = { generalImgLevel: val };
    chrome.storage.sync.set(forStorage);
  };
  const handleIframeLevelChange = (
    event: React.MouseEvent<HTMLElement>,
    val: FilterLevel
  ) => {
    setGeneralIframeLevel(val);
    const forStorage: IStoredValues = { generalIframeLevel: val };
    chrome.storage.sync.set(forStorage);
  };

  return (
    <Box sx={{ filter: `contrast(${disabled ? ".1" : "1"})` }}>
      <Typography variant="subtitle1">Default Filters</Typography>

      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2}>
          <Typography variant="body2">images</Typography>
        </Grid>
        <Grid item xs={10}>
          <ToggleButtonGroup
            size="small"
            disabled={disabled}
            color="primary"
            value={generalImgLevel}
            exclusive
            onChange={handleImgLevelChange}
            aria-label="Image Filter Level"
            sx={{ width: 1 }}
          >
            <ToggleButton value={FilterLevel.None} sx={{ width: 1 }}>
              None
            </ToggleButton>
            <ToggleButton value={FilterLevel.Low} sx={{ width: 1 }}>
              Low
            </ToggleButton>
            <ToggleButton value={FilterLevel.Medium} sx={{ width: 1 }}>
              Medium
            </ToggleButton>
            <ToggleButton value={FilterLevel.High} sx={{ width: 1 }}>
              High
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="body2">iframes</Typography>
            <Tooltip title="Iframes are embedded websites often used for ads. Some sites also use iframes for regular content.">
              <IconButton size="small">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <ToggleButtonGroup
            size="small"
            disabled={disabled}
            color="primary"
            value={generalIframeLevel}
            exclusive
            onChange={handleIframeLevelChange}
            aria-label="Iframe Filter Level"
            sx={{ width: 1 }}
          >
            <ToggleButton value={FilterLevel.None} sx={{ width: 1 }}>
              None
            </ToggleButton>
            <ToggleButton value={FilterLevel.Low} sx={{ width: 1 }}>
              Low
            </ToggleButton>
            <ToggleButton value={FilterLevel.Medium} sx={{ width: 1 }}>
              Medium
            </ToggleButton>
            <ToggleButton value={FilterLevel.High} sx={{ width: 1 }}>
              High
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DefaultFilterSettings;
