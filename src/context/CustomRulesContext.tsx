import React, { useState, useContext, useEffect } from "react";

import { ICustomRule, IStoredDataOther, IStoredDataRules, FilterLevel } from "../types";

interface ICustomRulesContext {
  /** The last img filter level used for a custom rule */
  lastCustomImgLevelUsed: FilterLevel;
  /** The last iframe filter level used for a custom rule */
  lastCustomIframeLevelUsed: FilterLevel;
  /** An array of all the custom rules */
  customRulesArray: ICustomRule[];
  /** Callback when adding a custom rule. */
  onCustomRuleAdd: (rule: ICustomRule) => void;
  /** Callback when editing a custom rule. */
  onCustomRuleEdit: (rule: ICustomRule) => void;
  /** Callback when removing a single custom rule. */
  onCustomRuleRemove: (rule: ICustomRule) => void;
  /** Callback when removing all custom rules. */
  onCustomRuleRemoveAll: () => void;
  /** boolean, true if there are the max number of rules (150) */
  isMaxRulesReached: boolean;
}

const MAX_NUMBER_RULES = 150;

const CustomRulesContext = React.createContext<ICustomRulesContext>({
  lastCustomImgLevelUsed: FilterLevel.None,
  lastCustomIframeLevelUsed: FilterLevel.None,
  customRulesArray: [],
  onCustomRuleAdd: (rule: ICustomRule) => {},
  onCustomRuleEdit: (rule: ICustomRule) => {},
  onCustomRuleRemove: (rule: ICustomRule) => {},
  onCustomRuleRemoveAll: () => {},
  isMaxRulesReached: false,
});

interface IProps {
  children?: React.ReactNode;
}
const CustomRulesContextProvider = (props: IProps) => {
  const [lastCustomImgLevelUsed, setlastCustomImgLevelUsed] = useState<FilterLevel>(FilterLevel.None);
  const [lastCustomIframeLevelUsed, setlastCustomIframeLevelUsed] = useState<FilterLevel>(FilterLevel.None);
  const [customRulesArray, setCustomRuleArray] = useState<ICustomRule[]>([]);

  useEffect(() => {
    // Restores preferences stored in chrome.storage.
    chrome.storage.sync.get(
      {
        lastCustomImgLevelUsed: FilterLevel.None,
        lastCustomIframeLevelUsed: FilterLevel.None,
        customRulesArray0to49: [],
        customRulesArray50to99: [],
        customRulesArray100to149: [],
      },
      (items) => {
        const customRules = [
          ...items.customRulesArray0to49,
          ...items.customRulesArray50to99,
          ...items.customRulesArray100to149,
        ];
        setlastCustomImgLevelUsed(items.lastCustomImgLevelUsed);
        setlastCustomIframeLevelUsed(items.lastCustomIframeLevelUsed);

        setCustomRuleArray(customRules);
        // For debug
        // setCustomRuleArray(generateMockRules());
      }
    );
  }, []);

  const saveValues = (newVal: ICustomRule[], lastImgLevel: FilterLevel, lastIframeLevel: FilterLevel) => {
    /* If there's too much data within one key, we get this error: BYTES_PER_ITEM quota exceeded
    so split it up into chunks and store the data separately. */
    const forStorage: IStoredDataOther & IStoredDataRules = {
      customRulesArray0to49: newVal.slice(0, 50),
      customRulesArray50to99: newVal.slice(50, 100),
      customRulesArray100to149: newVal.slice(100, 150),
      lastCustomImgLevelUsed: lastImgLevel,
      lastCustomIframeLevelUsed: lastIframeLevel,
    };
    chrome.storage.sync.set(forStorage);
    setCustomRuleArray(newVal);
    setlastCustomImgLevelUsed(lastImgLevel);
    setlastCustomIframeLevelUsed(lastIframeLevel);
  };

  const onCustomRuleAdd = (newCustomRule: ICustomRule) => {
    const newArray = [...customRulesArray];
    newCustomRule.idx = customRulesArray.length; // This should have already been set, but make sure it's right
    newArray.push(newCustomRule);
    saveValues(newArray, newCustomRule.imgLevel, newCustomRule.iframeLevel);
  };

  const onCustomRuleEdit = (newCustomRule: ICustomRule) => {
    const newArray = [...customRulesArray];
    newArray[newCustomRule.idx] = newCustomRule;
    saveValues(newArray, newCustomRule.imgLevel, newCustomRule.iframeLevel);
  };

  const onCustomRuleRemove = (customRule: ICustomRule) => {
    const newArray = customRulesArray
      .filter((item) => {
        // Don't keep the element
        return item.idx !== customRule.idx;
      })
      .map((item, index) => {
        // Set new idx
        return { ...item, idx: index };
      });

    saveValues(
      newArray,
      lastCustomImgLevelUsed, // Keep the same
      lastCustomIframeLevelUsed // Keep the same
    );
  };
  const onCustomRuleRemoveAll = () => {
    saveValues(
      [],
      lastCustomImgLevelUsed, // Keep the same
      lastCustomIframeLevelUsed // Keep the same
    );
  };

  const isMaxRulesReached = customRulesArray.length >= MAX_NUMBER_RULES;

  const val: ICustomRulesContext = {
    lastCustomImgLevelUsed,
    lastCustomIframeLevelUsed,
    customRulesArray,
    onCustomRuleAdd,
    onCustomRuleEdit,
    onCustomRuleRemove,
    onCustomRuleRemoveAll,
    isMaxRulesReached,
  };
  return <CustomRulesContext.Provider value={val} {...props} />;
};

const useCustomRulesContext = () => {
  const context = useContext(CustomRulesContext);
  if (!context) {
    throw new Error(`useCustomRulesContext must be used within a CustomRulesContextProvider`);
  }
  return context;
};

export { CustomRulesContextProvider, useCustomRulesContext };
