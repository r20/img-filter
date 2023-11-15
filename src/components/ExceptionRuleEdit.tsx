import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
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
  console.log("jmr - rendering ExceptionRule", exceptionRule.idx);

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={2.5}>
        <Typography variant="body2">{exceptionRule.matchType}</Typography>
      </Grid>
      <Grid item xs={4.5}>
        <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
          {exceptionRule.matchString}
        </Typography>
      </Grid>
      <ExceptionRuleFilterEdit
        exceptionRule={exceptionRule}
        onImgLevelChange={(val) =>
          onExceptionRuleEdit({ ...exceptionRule, imgLevel: val })
        }
        onIframeLevelChange={(val) =>
          onExceptionRuleEdit({ ...exceptionRule, iframeLevel: val })
        }
      />
      <Grid item xs={1}>
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
      </Grid>
    </Grid>
  );
};

export default ExceptionRuleEdit;
