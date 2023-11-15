import React, { useState, useContext, useEffect } from "react";

import { IExceptionRule, IStoredValues, FilterLevel } from "../types";

interface IExceptionRulesContext {
  lastExceptionImgLevelUsed: FilterLevel;
  lastExceptionIframeLevelUsed: FilterLevel;
  exceptionRulesArray: IExceptionRule[];
  onExceptionRuleAdd: (rule: IExceptionRule) => void;
  onExceptionRuleEdit: (rule: IExceptionRule) => void;
  onExceptionRuleRemove: (rule: IExceptionRule) => void;
  onExceptionRuleRemoveAll: () => void;
}

const defaultStoredValues = {
  lastExceptionImgLevelUsed: FilterLevel.None,
  lastExceptionIframeLevelUsed: FilterLevel.None,
  exceptionRulesArray: [],
};

const ExceptionRulesContext = React.createContext<IExceptionRulesContext>({
  ...defaultStoredValues,
  onExceptionRuleAdd: (rule: IExceptionRule) => {},
  onExceptionRuleEdit: (rule: IExceptionRule) => {},
  onExceptionRuleRemove: (rule: IExceptionRule) => {},
  onExceptionRuleRemoveAll: () => {},
});

interface IProps {
  children?: React.ReactNode;
}
const ExceptionRulesContextProvider = (props: IProps) => {
  const [lastExceptionImgLevelUsed, setLastExceptionImgLevelUsed] =
    useState<FilterLevel>(defaultStoredValues.lastExceptionImgLevelUsed);
  const [lastExceptionIframeLevelUsed, setLastExceptionIframeLevelUsed] =
    useState<FilterLevel>(defaultStoredValues.lastExceptionIframeLevelUsed);
  const [exceptionRulesArray, setExceptionRuleArray] = useState<
    IExceptionRule[]
  >(defaultStoredValues.exceptionRulesArray);

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(defaultStoredValues, (items) => {
      setExceptionRuleArray(items.exceptionRulesArray);
    });
  }, []);

  const saveValues = (
    newVal: IExceptionRule[],
    lastImgLevel: FilterLevel,
    lastIframeLevel: FilterLevel
  ) => {
    const forStorage: IStoredValues = {
      exceptionRulesArray: newVal,
      lastExceptionImgLevelUsed: lastImgLevel,
      lastExceptionIframeLevelUsed: lastIframeLevel,
    };
    console.log("jmr - saving ", lastImgLevel, lastIframeLevel);
    chrome.storage.sync.set(forStorage);
    setExceptionRuleArray(newVal);
    setLastExceptionImgLevelUsed(lastImgLevel);
    setLastExceptionIframeLevelUsed(lastIframeLevel);
  };

  const onExceptionRuleAdd = (newExceptionRule: IExceptionRule) => {
    const newArray = [...exceptionRulesArray];
    newExceptionRule.idx = exceptionRulesArray.length; // This should have already been set, but make sure it's right
    newArray.push(newExceptionRule);
    saveValues(
      newArray,
      newExceptionRule.imgLevel,
      newExceptionRule.iframeLevel
    );
  };

  const onExceptionRuleEdit = (newExceptionRule: IExceptionRule) => {
    const newArray = [...exceptionRulesArray];
    newArray[newExceptionRule.idx] = newExceptionRule;
    saveValues(
      newArray,
      newExceptionRule.imgLevel,
      newExceptionRule.iframeLevel
    );
  };

  const onExceptionRuleRemove = (exceptionRule: IExceptionRule) => {
    console.log("jmr - remove site", exceptionRule.idx, exceptionRulesArray);
    const newArray = exceptionRulesArray
      .filter((item) => {
        console.log(
          "jmr - index for item and siteOveride",
          item.idx,
          exceptionRule.idx
        );
        // Don't keep the element
        return item.idx !== exceptionRule.idx;
      })
      .map((item, index) => {
        console.log("jmr - map", item, index);
        // Set new idx
        return { ...item, idx: index };
      });
    console.log("jmr - newArray", newArray);
    saveValues(
      newArray,
      lastExceptionImgLevelUsed, // Keep the same
      lastExceptionIframeLevelUsed // Keep the same
    );
  };
  const onExceptionRuleRemoveAll = () => {
    saveValues(
      [],
      lastExceptionImgLevelUsed, // Keep the same
      lastExceptionIframeLevelUsed // Keep the same
    );
  };

  const val: IExceptionRulesContext = {
    lastExceptionImgLevelUsed,
    lastExceptionIframeLevelUsed,
    exceptionRulesArray,
    onExceptionRuleAdd,
    onExceptionRuleEdit,
    onExceptionRuleRemove,
    onExceptionRuleRemoveAll,
  };
  return <ExceptionRulesContext.Provider value={val} {...props} />;
};

const useExceptionRulesContext = () => {
  const context = useContext(ExceptionRulesContext);
  if (!context) {
    throw new Error(
      `useExceptionRulesContext must be used within a ExceptionRulesContextProvider`
    );
  }
  return context;
};

export { ExceptionRulesContextProvider, useExceptionRulesContext };
