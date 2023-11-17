import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";

import { IStoredDataOther } from "../types";

const FilteringIsEnabled = () => {
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
    <Box display="flex" flexDirection="column" justifyContent="center">
      <FormControlLabel
        sx={{ mr: "0" }}
        control={
          <Switch
            checked={isEnabled}
            onChange={(evt) => saveIsEnabled(evt.target.checked)}
            inputProps={{ "aria-label": "Is Enabled" }}
          />
        }
        label="Enable Extension"
      />
    </Box>
  );
};

export default FilteringIsEnabled;
