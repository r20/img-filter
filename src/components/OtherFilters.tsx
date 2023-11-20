import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import CustomRuleEdit from "./CustomRuleEdit";
import { useCustomRulesContext } from "../context/CustomRulesContext";
import { useActiveTabContext } from "../context/ActiveTabContext";
import DefaultFilter from "./DefaultFilter";

/** This shows the other filters besides the current active filter. 
    If showDefaultFilter is set, shows that at the top before other filters. */
interface IProps {
  showDefaultFilter: boolean;
}
const OtherFilters = ({ showDefaultFilter }: IProps) => {
  const [isListOpen, setIsListOpen] = useState(false);
  const {
    customRulesArray,
    onCustomRuleEdit,
    onCustomRuleRemove,
    onCustomRuleRemoveAll,
    isMaxRulesReached,
  } = useCustomRulesContext();

  const { activeTabCustomRule } = useActiveTabContext();

  /* This became sluggish with hundreds.  Allowing just 150 rules to keep performance OK.
  If really needed, we could redo how this so each isn't re-rendered on an update to allow thousands.
  But it should be good for now. */

  const otherRules = customRulesArray.filter((customRule) => {
    return customRule?.idx !== activeTabCustomRule?.idx; // Don't show current tab filter
  });

  return (
    (activeTabCustomRule || otherRules.length > 0 || showDefaultFilter) && (
      <Box>
        <Accordion
          elevation={0}
          sx={{ "&:before": { height: "0px" } }}
          expanded={isListOpen}
          onChange={() => setIsListOpen(!isListOpen)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{ padding: 0 }}
          >
            <Typography variant="subtitle2">Other Filters</Typography>
            {isMaxRulesReached && (
              <Typography
                sx={{ color: "error.main", ml: "15px" }}
                variant="subtitle2"
              >
                (Max Number Reached)
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {showDefaultFilter ? <DefaultFilter /> : null}
              {otherRules
                .map((customRule) => {
                  return (
                    <CustomRuleEdit
                      customRule={customRule}
                      onCustomRuleEdit={onCustomRuleEdit}
                      onCustomRuleRemove={onCustomRuleRemove}
                    />
                  );
                  // Call reverse AFTER map because it's ok to modify the new map array but we don't want to modify the original
                })
                .reverse()}

              {otherRules.length > 0 && (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  minHeight="100px"
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={onCustomRuleRemoveAll}
                  >
                    Remove All Custom Filters
                  </Button>
                </Box>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </Box>
    )
  );
};

export default OtherFilters;
