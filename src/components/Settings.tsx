import React from "react";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";

import { useActiveTabContext } from "../context/ActiveTabContext";
import FilteringIsEnabled from "./FilteringIsEnabled";
import ActiveFilter from "./ActiveFilter";
import FilterCreate from "./FilterCreate";
import OtherFilters from "./OtherFilters";
import { useCustomRulesContext } from "../context/CustomRulesContext";
import { MatchType } from "../types";
import { filterCreateHeight } from "./FilterCreate";

const StyledDiv = styled.div`
  width: 760px;
  padding: 15px;
  min-height: 250px;
  & > * {
    margin-top: 40px;
  }
  & > *:first-child {
    margin-top: 25px;
  }
  & > *:last-child {
    margin-bottom: 25px;
  }
`;

const Settings = () => {
  const { activeEligibleHostname, activeTabCustomRule } = useActiveTabContext();
  const { customRulesArray, lastCustomImgLevelUsed, lastCustomIframeLevelUsed, onCustomRuleAdd, isMaxRulesReached } =
    useCustomRulesContext();

  return (
    <StyledDiv>
      <FilteringIsEnabled />
      {activeEligibleHostname ? (
        <>
          <ActiveFilter />

          {isMaxRulesReached ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: filterCreateHeight,
              }}
            >
              <Typography variant="subtitle1" color="main.error" sx={{ fontWeight: "light" }}>
                Maximum number of custom rules reached.
              </Typography>
            </div>
          ) : (
            <FilterCreate
              initialCustomRule={{
                matchType: MatchType.StartsWith,
                // New idx at end of array
                idx: customRulesArray.length,
                matchString: activeEligibleHostname,
                imgLevel: lastCustomImgLevelUsed,
                iframeLevel: lastCustomIframeLevelUsed,
              }}
              onSave={(newRule) => {
                onCustomRuleAdd(newRule);
              }}
            />
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "50px",
            marginBottom: "50px",
          }}
        >
          <Typography variant="subtitle1" color="main.secondary" sx={{ fontWeight: "light" }}>
            This page is not eligible for filtering.
          </Typography>
        </div>
      )}
      <OtherFilters showDefaultFilter={!!(activeTabCustomRule || !activeEligibleHostname)} />
    </StyledDiv>
  );
};

export default Settings;
