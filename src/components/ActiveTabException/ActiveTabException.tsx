import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import ActiveTabExceptionRuleMatch from "./ActiveTabExceptionRuleMatch";
import ActiveTabExceptionRuleCreate from "./ActiveTabExceptionRuleCreate";
import { MatchType } from "../../types";
import { useExceptionRulesContext } from "../../context/ExceptionRulesContext";
import { useActiveTabContext } from "../../context/ActiveTabContext";

const ActiveTabException = () => {
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  const {
    onExceptionRuleAdd,
    exceptionRulesArray,
    lastExceptionImgLevelUsed,
    lastExceptionIframeLevelUsed,
    isMaxExceptionsReached,
  } = useExceptionRulesContext();
  const { activeEligibleHostname, activeTabMatchingRules } =
    useActiveTabContext();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minHeight="100px"
    >
      {isCreatingRule && (
        <ActiveTabExceptionRuleCreate
          initialExceptionRule={{
            matchType: MatchType.StartsWith,
            idx: exceptionRulesArray.length, // New idx at end of array
            matchString: activeEligibleHostname,
            imgLevel: lastExceptionImgLevelUsed,
            iframeLevel: lastExceptionIframeLevelUsed,
          }}
          onSave={(newRule) => {
            onExceptionRuleAdd(newRule);
            setIsCreatingRule(false);
          }}
          onCancel={() => setIsCreatingRule(false)}
        />
      )}
      {!isCreatingRule && !activeTabMatchingRules.length && (
        <Button
          variant="outlined"
          onClick={() => {
            setIsCreatingRule(true);
          }}
          disabled={!activeEligibleHostname || isMaxExceptionsReached}
        >
          Add Exception
          {activeEligibleHostname ? ` for ${activeEligibleHostname}` : ""}
        </Button>
      )}
      {!isCreatingRule &&
        activeEligibleHostname &&
        !!activeTabMatchingRules.length && <ActiveTabExceptionRuleMatch />}
    </Box>
  );
};

export default ActiveTabException;
