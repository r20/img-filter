import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { MatchType } from "../types";
interface IProps {
  idPrefix: string;
  selectedValue: MatchType;
  onSelection: (newVal: MatchType) => void;
}

const MatchTypeSelect = ({ idPrefix, selectedValue, onSelection }: IProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    onSelection(event.target.value as unknown as MatchType);
  };

  const val = selectedValue as unknown as string;
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel id={`${idPrefix}-host-match-type-select-label`}>Should</InputLabel>
        <Select
          labelId={`${idPrefix}-host-match-type-select-label`}
          id={`${idPrefix}-host-match-type-select`}
          value={val}
          label="Should"
          onChange={handleChange}
        >
          <MenuItem value={MatchType.Contains}>Contain</MenuItem>
          <MenuItem value={MatchType.StartsWith}>Start With</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default MatchTypeSelect;
