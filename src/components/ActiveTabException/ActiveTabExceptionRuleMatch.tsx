import React from "react";
import Typography from "@mui/material/Typography";

import ExceptionRuleEdit from "../ExceptionRuleEdit";
import { useExceptionRulesContext } from "../../context/ExceptionRulesContext";
import { useActiveTabContext } from "../../context/ActiveTabContext";

const ActiveTabExceptionRuleMatch = () => {
  const { onExceptionRuleEdit, onExceptionRuleRemove } =
    useExceptionRulesContext();

  const { activeTabMatchingRules } = useActiveTabContext();

  // background.ts uses the last match. Keep it consistent.
  const lastMatch = activeTabMatchingRules[activeTabMatchingRules.length - 1];

  return lastMatch ? (
    <>
      <Typography variant="subtitle2">Filters For Current Tab</Typography>

      <ExceptionRuleEdit
        exceptionRule={lastMatch}
        onExceptionRuleEdit={onExceptionRuleEdit}
        onExceptionRuleRemove={onExceptionRuleRemove}
      />
    </>
  ) : null;
};

export default ActiveTabExceptionRuleMatch;
