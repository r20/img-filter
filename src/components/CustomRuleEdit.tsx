import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import FilterSettings from "./FilterSettings";
import { ICustomRule } from "../types";
import FilterDescriptionWrapper from "./FilterDescriptionWrapper";

interface IProps {
  customRule: ICustomRule;
  onCustomRuleEdit: (newCustomRule: ICustomRule) => void;
  onCustomRuleRemove: (CustomRule: ICustomRule) => void;
}

/* This shows a custom rule filter (not default) and allows editing that filter. */
const CustomRuleEdit = ({ customRule, onCustomRuleEdit, onCustomRuleRemove }: IProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <FilterDescriptionWrapper>
        <Typography variant="body2" width={69} sx={{ flexShrink: 0 }}>
          {customRule.matchType}
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          {customRule.matchString}
        </Typography>
      </FilterDescriptionWrapper>

      <FilterSettings
        imgLevel={customRule.imgLevel}
        iframeLevel={customRule.iframeLevel}
        onImgLevelChange={(val) => onCustomRuleEdit({ ...customRule, imgLevel: val })}
        onIframeLevelChange={(val) => onCustomRuleEdit({ ...customRule, iframeLevel: val })}
      />

      <IconButton onClick={() => onCustomRuleRemove(customRule)}>
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
  );
};

export default CustomRuleEdit;
