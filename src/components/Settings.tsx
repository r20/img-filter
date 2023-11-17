import React from "react";
import styled from "@emotion/styled";

import DefaultFilterSettings from "./DefaultFilterSettings";
import AllExceptionRules from "./AllExceptionRules";
import ActiveTabException from "./ActiveTabException";
import { useActiveTabContext } from "../context/ActiveTabContext";
import FilteringIsEnabled from "./FilteringIsEnabled";

// jmr - width was 770
const StyledDiv = styled.div`
  width: 760px;
  padding: 15px;
  min-height: 280px;
  & > * {
    margin-top: 40px;
  }
`;

const Settings = () => {
  const { activeTabMatchingRules } = useActiveTabContext();

  /* jmr - If NOT on http/https I should maybe disable default filters and even (Enable Extension toggle)
    and have a red message that no filtering is done for current tab */
  return (
    <StyledDiv>
      <FilteringIsEnabled />
      <DefaultFilterSettings disabled={activeTabMatchingRules.length > 0} />
      <ActiveTabException />
      <AllExceptionRules />
    </StyledDiv>
  );
};

export default Settings;
