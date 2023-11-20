import React, { useState } from "react";
import styled from "@emotion/styled";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import MatchTypeSelect from "./MatchTypeSelect";
import FilterEdit from "./FilterEdit";

import { MatchType, ICustomRule } from "../types";

import { getMatchingRules } from "../utilities";
import { useActiveTabContext } from "../context/ActiveTabContext";
import { useCustomRulesContext } from "../context/CustomRulesContext";

export const filterCreateHeight = "107px";

const StyledTextField = styled(TextField)({
  // This makes it so the helper text doesn't shift the vertical position of the TextField
  "& .MuiFormHelperText-root": {
    position: "absolute",
    top: "100%",
  },
});

interface IProps {
  initialCustomRule: ICustomRule;
  onSave: (newCustomRule: ICustomRule) => void;
}

const FilterCreate = ({ initialCustomRule, onSave }: IProps) => {
  const [customRule, setCustomRule] = useState<ICustomRule>(initialCustomRule);
  const [needAddAnotherConfirm, setNeedAddAnotherConfirm] = useState(true);

  const { customRulesArray } = useCustomRulesContext();
  const { activeEligibleUrl, activeEligibleHostname, activeTabCustomRule } =
    useActiveTabContext();

  const matchingRules = getMatchingRules(activeEligibleUrl, [customRule]);
  const isMatching = activeEligibleUrl && matchingRules.length;

  let isError = false;
  let helperText = "";
  if (!customRule.matchString) {
    isError = false; // if it's empty, no error
  } else {
    const matches = customRulesArray.filter((rule) => {
      return (
        rule?.matchString === customRule.matchString &&
        rule?.matchType === customRule.matchType
      );
    });

    if (matches?.length > 0) {
      isError = true;
      helperText = "Matches an existing custom rule";
    } else if (!isMatching) {
      isError = false; // We'll let them create a new rule in this case
      helperText = "Doesn't match current tab's address";
    }
  }

  const isDisabled = isError || !customRule.matchString;

  const onClickAdd = () => {
    onSave(customRule);
    if (activeEligibleHostname) {
      // Make a copy but change matchString back to hostname (in case they edited it)
      setCustomRule({ ...customRule, matchString: activeEligibleHostname });
    } else {
      // Make a copy
      setCustomRule({ ...customRule });
    }
    setNeedAddAnotherConfirm(true);
  };

  return activeTabCustomRule && needAddAnotherConfirm ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: filterCreateHeight,
      }}
    >
      <Button
        variant="outlined"
        onClick={() => {
          setNeedAddAnotherConfirm(false);
        }}
      >
        Add Another Custom Filter
      </Button>
    </div>
  ) : (
    <div style={{ minHeight: filterCreateHeight }}>
      <Typography variant="subtitle2">Add Custom Filter</Typography>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <MatchTypeSelect
          idPrefix="add"
          selectedValue={customRule.matchType}
          onSelection={(val: MatchType) => {
            setCustomRule({ ...customRule, matchType: val });
          }}
        />

        <StyledTextField
          id={`matchString-${customRule.idx}`}
          label="text"
          value={customRule.matchString}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.value;
            setCustomRule({ ...customRule, matchString: val });
          }}
          size="small"
          fullWidth
          variant="standard"
          error={isError}
          helperText={helperText}
        />

        <FilterEdit
          imgLevel={customRule.imgLevel}
          iframeLevel={customRule.iframeLevel}
          onImgLevelChange={(val) =>
            setCustomRule({ ...customRule, imgLevel: val })
          }
          onIframeLevelChange={(val) =>
            setCustomRule({ ...customRule, iframeLevel: val })
          }
        />

        <Button
          size="small"
          variant="contained"
          onClick={onClickAdd}
          disabled={isDisabled}
        >
          Add
        </Button>
      </div>
    </div>
  );
};

export default FilterCreate;
