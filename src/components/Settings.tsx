import React from "react";
import styled from "@emotion/styled";

import DefaultFilterSettings from "./DefaultFilterSettings";
import AllExceptionRules from "./AllExceptionRules";
import ActiveTabException from "./ActiveTabException";
import { useActiveTabContext } from "../context/ActiveTabContext";
import FilteringIsEnabled from "./FilteringIsEnabled";

const StyledDiv = styled.div`
  width: 770px;
  margin: 15px;
  min-height: 280px;
  & > * {
    margin-top: 40px;
  }
`;

const Settings = () => {
  const { activeTabMatchingRules } = useActiveTabContext();

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
