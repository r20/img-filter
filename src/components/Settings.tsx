import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

import StandardFilterSettings from "./StandardFilterSettings";
import SiteOverrideList from "./SiteOverrideList";

const Settings = () => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(
      {
        isEnabled: true,
      },
      (items) => {
        setIsEnabled(items.isEnabled);
      }
    );
  }, []);

  const saveIsEnabled = (newIsEnabled: boolean) => {
    chrome.storage.sync.set({ isEnabled: newIsEnabled });
    setIsEnabled(newIsEnabled);
  };

  return (
    <div style={{ width: "700px", padding: "20px", minHeight: "280px" }}>
      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={(evt) => saveIsEnabled(evt.target.checked)}
              inputProps={{ "aria-label": "Is Enabled" }}
            />
          }
          label="Enable"
        />

        <StandardFilterSettings />

        <SiteOverrideList />
      </Stack>
    </div>
  );
};

export default Settings;
