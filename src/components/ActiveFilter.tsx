import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import FilterSettings from "./FilterSettings";
import { useCustomRulesContext } from "../context/CustomRulesContext";
import { useActiveTabContext } from "../context/ActiveTabContext";
import DefaultFilter from "./DefaultFilter";
import FilterDescriptionWrapper from "./FilterDescriptionWrapper";

/** Shows the filters in effect for the current website. */
const ActiveFilter = () => {
  const { activeTabCustomRule } = useActiveTabContext();
  const { onCustomRuleEdit, onCustomRuleRemove } = useCustomRulesContext();

  return !activeTabCustomRule ? (
    <div>
      <Typography variant="subtitle2">Current Tab Filter (DEFAULT)</Typography>
      <DefaultFilter />
    </div>
  ) : (
    <div>
      <Typography variant="subtitle2">Current Tab Filter</Typography>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <FilterDescriptionWrapper>
          <Typography variant="body2" width={69} sx={{ flexShrink: 0 }}>
            {activeTabCustomRule.matchType}
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
            {activeTabCustomRule.matchString}
          </Typography>
        </FilterDescriptionWrapper>
        <FilterSettings
          imgLevel={activeTabCustomRule.imgLevel}
          iframeLevel={activeTabCustomRule.iframeLevel}
          onImgLevelChange={(val) => onCustomRuleEdit({ ...activeTabCustomRule, imgLevel: val })}
          onIframeLevelChange={(val) => onCustomRuleEdit({ ...activeTabCustomRule, iframeLevel: val })}
        />

        <IconButton onClick={() => onCustomRuleRemove(activeTabCustomRule)}>
          <CloseIcon
            sx={{
              color: "error.main",
              "&:hover": {
                color: "error.dark",
              },
            }}
          />
        </IconButton>
      </div>
    </div>
  );
};

export default ActiveFilter;
