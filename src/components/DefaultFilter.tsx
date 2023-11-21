import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { FilterLevel, IStoredDataOther } from "../types";
import FilterEdit from "./FilterEdit";

/* These setting apply to all sites that don't have custom rules */
const DefaultFilter = () => {
  const [generalImgLevel, setGeneralImgLevel] = useState<FilterLevel>(FilterLevel.Low);
  const [generalIframeLevel, setGeneralIframeLevel] = useState<FilterLevel>(FilterLevel.High);

  useEffect(() => {
    const defaults: IStoredDataOther = {
      generalImgLevel: FilterLevel.Low,
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
      <Typography variant="body2" width={365} sx={{ fontWeight: "light" }}>
        DEFAULT
      </Typography>

      <Typography variant="body2" width={69}>
        {" " /* This is here to make sure spacing is similar to FilterEdit */}
      </Typography>

      <FilterEdit
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
