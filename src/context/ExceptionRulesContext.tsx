import React, { useState, useContext, useEffect } from "react";

import {
  IExceptionRule,
  IStoredDataOther,
  IStoredDataRules,
  FilterLevel,
} from "../types";

interface IExceptionRulesContext {
  lastExceptionImgLevelUsed: FilterLevel;
  lastExceptionIframeLevelUsed: FilterLevel;
  exceptionRulesArray: IExceptionRule[];
  onExceptionRuleAdd: (rule: IExceptionRule) => void;
  onExceptionRuleEdit: (rule: IExceptionRule) => void;
  onExceptionRuleRemove: (rule: IExceptionRule) => void;
  onExceptionRuleRemoveAll: () => void;
  isMaxExceptionsReached: boolean;
}

const ExceptionRulesContext = React.createContext<IExceptionRulesContext>({
  lastExceptionImgLevelUsed: FilterLevel.None,
  lastExceptionIframeLevelUsed: FilterLevel.None,
  exceptionRulesArray: [],
  onExceptionRuleAdd: (rule: IExceptionRule) => {},
  onExceptionRuleEdit: (rule: IExceptionRule) => {},
  onExceptionRuleRemove: (rule: IExceptionRule) => {},
  onExceptionRuleRemoveAll: () => {},
  isMaxExceptionsReached: false,
});

interface IProps {
  children?: React.ReactNode;
}
const ExceptionRulesContextProvider = (props: IProps) => {
  const [lastExceptionImgLevelUsed, setLastExceptionImgLevelUsed] =
    useState<FilterLevel>(FilterLevel.None);
  const [lastExceptionIframeLevelUsed, setLastExceptionIframeLevelUsed] =
    useState<FilterLevel>(FilterLevel.None);
  const [exceptionRulesArray, setExceptionRuleArray] = useState<
    IExceptionRule[]
  >([]);

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(
      {
        lastExceptionImgLevelUsed: FilterLevel.None,
        lastExceptionIframeLevelUsed: FilterLevel.None,
        exceptionRulesArray0to49: [],
        exceptionRulesArray50to99: [],
        exceptionRulesArray100to149: [],
      },
      (items) => {
        const exceptionRules = [
          ...items.exceptionRulesArray0to49,
          ...items.exceptionRulesArray50to99,
          ...items.exceptionRulesArray100to149,
        ];
        setLastExceptionImgLevelUsed(items.lastExceptionImgLevelUsed);
        setLastExceptionIframeLevelUsed(items.lastExceptionIframeLevelUsed);

        setExceptionRuleArray(exceptionRules);
        // For debug
        // setExceptionRuleArray(generateMockRules());
      }
    );
  }, []);

  const saveValues = (
    newVal: IExceptionRule[],
    lastImgLevel: FilterLevel,
    lastIframeLevel: FilterLevel
  ) => {
    const forStorage: IStoredDataOther & IStoredDataRules = {
      exceptionRulesArray0to49: newVal.slice(0, 50),
      exceptionRulesArray50to99: newVal.slice(50, 100),
      exceptionRulesArray100to149: newVal.slice(100, 150),
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

  const isMaxExceptionsReached = exceptionRulesArray.length >= 150;

  const val: IExceptionRulesContext = {
    lastExceptionImgLevelUsed,
    lastExceptionIframeLevelUsed,
    exceptionRulesArray,
    onExceptionRuleAdd,
    onExceptionRuleEdit,
    onExceptionRuleRemove,
    onExceptionRuleRemoveAll,
    isMaxExceptionsReached,
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
