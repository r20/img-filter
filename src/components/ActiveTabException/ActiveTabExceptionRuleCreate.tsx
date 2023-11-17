import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
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
      <Typography variant="subtitle2">Add Exception For Current Tab</Typography>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <MatchTypeSelect
          idPrefix="add"
          selectedValue={exceptionRule.matchType}
          onSelection={(val: MatchType) => {
            setExceptionRule({ ...exceptionRule, matchType: val });
          }}
        />

        <TextField
          id={`matchString-${exceptionRule.idx}`}
          label="text"
          value={exceptionRule.matchString}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;
            setExceptionRule({ ...exceptionRule, matchString: val });
          }}
          size="small"
          fullWidth
        />

        <ExceptionRuleFilterEdit
          exceptionRule={exceptionRule}
          onImgLevelChange={(val) =>
            setExceptionRule({ ...exceptionRule, imgLevel: val })
          }
          onIframeLevelChange={(val) =>
            setExceptionRule({ ...exceptionRule, iframeLevel: val })
          }
        />

        <Button
          size="small"
          variant="contained"
          onClick={() => onSave(exceptionRule)}
          disabled={!isMatching}
        >
          Add
        </Button>

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
      </div>
    </>
  );
};

export default ActiveTabExceptionRuleCreate;
