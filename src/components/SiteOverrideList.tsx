import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import SiteOverride from "./SiteOverride";
import useActiveTab from "../hooks/useActiveTab";
import { FilterLevel, MatchType, ISiteOverride } from "../types";

const SiteOverrideList = () => {
  const [siteOverrideArray, setSiteOverrideArray] = useState<ISiteOverride[]>([]);

  const { activeTab } = useActiveTab();

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(
      {
        siteOverrideArray: [],
      },
      (items) => {
        setSiteOverrideArray(items.siteOverrideArray);
      }
    );
  }, []);

  // jmr - there's no point in using useCallback because array changes everytime an item changes

  const onSiteOverrideChange = React.useCallback(
    (newSiteOverride: ISiteOverride) => {
      const newArray = [...siteOverrideArray];
      newArray[newSiteOverride.idx] = newSiteOverride;
    },
    [siteOverrideArray]
  );

  const onRemoveSiteOverride = React.useCallback(
    (siteOverride: ISiteOverride) => {
      console.log("jmr - remove site", siteOverride.idx, siteOverrideArray);
      const newArray = siteOverrideArray
        .filter((item) => {
          console.log("jmr - index for item and siteOveride", item.idx, siteOverride.idx);
          // Don't keep the element
          return item.idx !== siteOverride.idx;
        })
        .map((item, index) => {
          console.log("jmr - map", item, index);
          // Set new idx
          return { ...item, idx: index };
        });
      console.log("jmr - newArray", newArray);
      setSiteOverrideArray(newArray);
    },
    [siteOverrideArray]
  );

  const onClickAdd = () => {
    setSiteOverrideArray([
      ...siteOverrideArray,
      {
        imgLevel: FilterLevel.Low,
        iframeLevel: FilterLevel.High,
        matchString: "jmr",
        matchType: MatchType.Contains,
        idx: siteOverrideArray.length,
      },
    ]);
  };
  return (
    <>
      <Typography variant="h6">Site Specific Filters</Typography>

      <Button variant="outlined" onClick={onClickAdd} disabled={!activeTab?.url}>
        Add {activeTab?.url || ""}
      </Button>
      <div>
        {siteOverrideArray.map((siteOverride) => {
          return (
            <SiteOverride
              siteOverride={siteOverride}
              setSiteOverride={onSiteOverrideChange}
              onRemoveSiteOverride={onRemoveSiteOverride}
            />
          );
        })}
      </div>
    </>
  );
};

export default SiteOverrideList;
