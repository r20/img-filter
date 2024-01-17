import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { IStoredDataOther } from "../types";

/** Switch for turning on/off all filtering */
const ExtensionEnabledSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Restores preferences stored in chrome.storag
    const defaults = { isEnabled: true };
    chrome.storage.sync.get(defaults, (items) => {
      setIsEnabled(items.isEnabled);
    });
  }, []);

  const saveIsEnabled = (newIsEnabled: boolean) => {
    const forStorage: IStoredDataOther = { isEnabled: newIsEnabled };
    chrome.storage.sync.set(forStorage);
    setIsEnabled(newIsEnabled);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <FormControlLabel
        control={
          <Switch
            checked={isEnabled}
            onChange={(evt) => saveIsEnabled(evt.target.checked)}
            inputProps={{ "aria-label": "Is Enabled" }}
          />
        }
        label="Enable Extension"
      />
      <Tooltip title="Filter images and iframes. Iframes are embedded websites often used for ads, but may also be used for regular content.">
        <IconButton size="small">
          <InfoOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ExtensionEnabledSwitch;
