import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { FilterLevel, IStoredDataOther } from "../types";
import FilterSettings from "./FilterSettings";
import FilterDescriptionWrapper from "./FilterDescriptionWrapper";

/* These setting apply to all sites that don't have custom filter rules */
const DefaultFilter = () => {
  const [generalImgLevel, setGeneralImgLevel] = useState<FilterLevel>(FilterLevel.None);
  const [generalIframeLevel, setGeneralIframeLevel] = useState<FilterLevel>(FilterLevel.High);

  useEffect(() => {
    const defaults: IStoredDataOther = {
      generalImgLevel: FilterLevel.None,
      generalIframeLevel: FilterLevel.High,
    };
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(defaults, (items) => {
      setGeneralImgLevel(items.generalImgLevel);
      setGeneralIframeLevel(items.generalIframeLevel);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <FilterDescriptionWrapper>
        <Typography variant="body2" sx={{ fontWeight: "light" }}>
          DEFAULT
        </Typography>
      </FilterDescriptionWrapper>
      <FilterSettings
        imgLevel={generalImgLevel}
        iframeLevel={generalIframeLevel}
        onImgLevelChange={(val) => {
          setGeneralImgLevel(val);
          const forStorage: IStoredDataOther = { generalImgLevel: val };
          chrome.storage.sync.set(forStorage);
        }}
        onIframeLevelChange={(val) => {
          setGeneralIframeLevel(val);
          const forStorage: IStoredDataOther = { generalIframeLevel: val };
          chrome.storage.sync.set(forStorage);
        }}
      />
    </div>
  );
};

export default DefaultFilter;
