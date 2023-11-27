import React from "react";
import styled from "@emotion/styled";

/** A standard width flex div to bring consistency to ActiveFilter, DefaultFilter,
 * CustomRuleEdit, and FilterCreate */
const FilterDesciptionDiv = styled.div`
  display: flex;
  alignitems: center;
  gap: 15px;
  width: 390px;
  flex-shrink: 0;
`;

export default FilterDesciptionDiv;
