import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ExceptionRuleFilterEdit from "./ExceptionRuleFilterEdit";
import { IExceptionRule } from "../types";

interface IProps {
  exceptionRule: IExceptionRule;
  onExceptionRuleEdit: (newExceptionRule: IExceptionRule) => void;
  onExceptionRuleRemove: (ExceptionRule: IExceptionRule) => void;
}

const ExceptionRuleEdit = ({
  exceptionRule,
  onExceptionRuleEdit,
  onExceptionRuleRemove,
}: IProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Typography variant="body2" width={69}>
        {exceptionRule.matchType}
      </Typography>

      <Typography variant="body2" width={400} sx={{ wordBreak: "break-word" }}>
        {exceptionRule.matchString}
      </Typography>

      <ExceptionRuleFilterEdit
        exceptionRule={exceptionRule}
        onImgLevelChange={(val) =>
          onExceptionRuleEdit({ ...exceptionRule, imgLevel: val })
        }
        onIframeLevelChange={(val) =>
          onExceptionRuleEdit({ ...exceptionRule, iframeLevel: val })
        }
      />

      <IconButton onClick={() => onExceptionRuleRemove(exceptionRule)}>
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

export default ExceptionRuleEdit;
