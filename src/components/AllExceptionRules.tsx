import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ExceptionRuleEdit from "./ExceptionRuleEdit";
import { useExceptionRulesContext } from "../context/ExceptionRulesContext";

const AllExceptionRules = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const {
    exceptionRulesArray,
    onExceptionRuleEdit,
    onExceptionRuleRemove,
    onExceptionRuleRemoveAll,
  } = useExceptionRulesContext();

  return exceptionRulesArray.length > 0 ? (
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
          <Typography variant="subtitle1">All Exception Filters</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <Grid container direction="column-reverse">
            {exceptionRulesArray.map((exceptionRule) => {
              return (
                <Grid item xs={12}>
                  <ExceptionRuleEdit
                    exceptionRule={exceptionRule}
                    onExceptionRuleEdit={onExceptionRuleEdit}
                    onExceptionRuleRemove={onExceptionRuleRemove}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            minHeight="100px"
          >
            <Button
              variant="outlined"
              color="error"
              onClick={onExceptionRuleRemoveAll}
            >
              Remove All Exception Filters
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  ) : null;
};

export default AllExceptionRules;
