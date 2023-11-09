import React, { useEffect, useState } from "react";
import debounce from "lodash/debounce";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import { FilterLevel } from "../types";

/* These setting apply to all sites that don't have site specific settings */
const StandardFilterSettings = () => {
  const [imgLevel, setImgLevel] = useState<FilterLevel>(FilterLevel.Low);
  const [iframeLevel, setIframeLevel] = useState<FilterLevel>(FilterLevel.Medium);

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(
      {
        imgLevel: FilterLevel.Low,
        iframeLevel: FilterLevel.Medium,
      },
      (items) => {
        setImgLevel(items.imgLevel);
        setIframeLevel(items.iframeLevel);
      }
    );
  }, []);

  const saveImgLevel = (newVal: FilterLevel) => {
    chrome.storage.sync.set({ imgLevel: newVal });
  };
  const saveIframeLevel = (newVal: FilterLevel) => {
    chrome.storage.sync.set({ iframeLevel: newVal });
  };

  const debouncedSaveImgLevel = React.useCallback(debounce(saveImgLevel, 200), []);
  const debouncedSaveIframeLevel = React.useCallback(debounce(saveIframeLevel, 200), []);

  useEffect(() => {
    // Cleanup when unmount
    return () => {
      debouncedSaveImgLevel.cancel();
      debouncedSaveIframeLevel.cancel();
    };
  }, []);

  const handleImgLevelChange = (event: React.MouseEvent<HTMLElement>, val: FilterLevel) => {
    setImgLevel(val);
    debouncedSaveImgLevel(val);
  };
  const handleIframeLevelChange = (event: React.MouseEvent<HTMLElement>, val: FilterLevel) => {
    setIframeLevel(val);
    debouncedSaveIframeLevel(val);
  };

  return (
    <>
      <Typography variant="h6">Default Filters</Typography>

      <Grid container spacing={1} alignItems="center">
        <Grid item xs={2}>
          <Typography variant="subtitle1">images</Typography>
        </Grid>
        <Grid item xs={10}>
          <ToggleButtonGroup
            color="primary"
            value={imgLevel}
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
            <Typography variant="subtitle1">iframes</Typography>
            <Tooltip title="Iframes are embedded websites often used for ads. Some sites also use iframes for regular content.">
              <IconButton>
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Grid>
        <Grid item xs={10}>
          <ToggleButtonGroup
            color="primary"
            value={iframeLevel}
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
    </>
  );
};

export default StandardFilterSettings;
