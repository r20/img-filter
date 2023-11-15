import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import MatchTypeSelect from "../MatchTypeSelect";
import ExceptionRuleFilterEdit from "../ExceptionRuleFilterEdit";

import { MatchType, IExceptionRule } from "../../types";

import { getMatchingRules } from "../../utilities";
import { useActiveTabContext } from "../../context/ActiveTabContext";

interface IProps {
  initialExceptionRule: IExceptionRule;
  onSave: (newExceptionRule: IExceptionRule) => void;
  onCancel: () => void;
}

const ActiveTabExceptionRuleCreate = ({
  initialExceptionRule,
  onSave,
  onCancel,
}: IProps) => {
  const [exceptionRule, setExceptionRule] =
    useState<IExceptionRule>(initialExceptionRule);

  const { activeEligibleUrl } = useActiveTabContext();

  const matchingRules = getMatchingRules(activeEligibleUrl, [exceptionRule]);

  const isMatching = activeEligibleUrl && matchingRules.length;

  console.log(
    "jmr - match type exceptionRule",
    exceptionRule.matchType,
    exceptionRule
  );
  return (
    <>
      <Typography variant="subtitle1">Add Exception For Current Tab</Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={2.5}>
          <MatchTypeSelect
            idPrefix="add"
            selectedValue={exceptionRule.matchType}
            onSelection={(val: MatchType) => {
              setExceptionRule({ ...exceptionRule, matchType: val });
            }}
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            id={`matchString-${exceptionRule.idx}`}
            label="string"
            value={exceptionRule.matchString}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const val = event.target.value;
              setExceptionRule({ ...exceptionRule, matchString: val });
            }}
            size="small"
            fullWidth
          />
        </Grid>
        <ExceptionRuleFilterEdit
          exceptionRule={exceptionRule}
          onImgLevelChange={(val) =>
            setExceptionRule({ ...exceptionRule, imgLevel: val })
          }
          onIframeLevelChange={(val) =>
            setExceptionRule({ ...exceptionRule, iframeLevel: val })
          }
        />
        <Grid item xs={1}>
          <Button
            size="small"
            variant="contained"
            onClick={() => onSave(exceptionRule)}
            disabled={!isMatching}
          >
            Add
          </Button>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={onCancel}>
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
    </>
  );
};

export default ActiveTabExceptionRuleCreate;
