import React from "react";
import styled from "@emotion/styled";

/** A standard width flex div to bring consistency to ActiveFilter, DefaultFilter,
 * CustomRuleEdit, and FilterCreate */
const FilterDesciptionWrapper = styled.div`
  display: flex;
  alignitems: center;
  gap: 15px;
  width: 380px;
  flex-shrink: 0;
`;

export default FilterDesciptionWrapper;
