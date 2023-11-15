import React, { useContext } from "react";

import { IExceptionRule } from "../types";
import useActiveTab from "../hooks/useActiveTab";
import { getMatchingRules } from "../utilities";
import { useExceptionRulesContext } from "./ExceptionRulesContext";

/** activeTab has the chomre.tabs.Tab object of the current active tab, activeEligibleHostname and activeEligibleUrl.
 * The activeEligible* strings are the hostname and url if eligible for filtering (else they are empty string).  */
interface IActiveTabContext {
  activeTab: chrome.tabs.Tab | null;
  activeEligibleHostname: string;
  activeEligibleUrl: string;
  activeTabMatchingRules: IExceptionRule[];
}

const ActiveTabContext = React.createContext<IActiveTabContext>({
  activeTab: null,
  activeEligibleHostname: "",
  activeEligibleUrl: "",
  activeTabMatchingRules: [],
});

interface IProps {
  children?: React.ReactNode;
}
const ActiveTabContextProvider = (props: IProps) => {
  const { activeTab, activeEligibleHostname, activeEligibleUrl } =
    useActiveTab();

  const { exceptionRulesArray } = useExceptionRulesContext();
  const activeTabMatchingRules = getMatchingRules(
    activeEligibleUrl,
    exceptionRulesArray
  );

  const val = {
    activeTab,
    activeEligibleHostname,
    activeEligibleUrl,
    activeTabMatchingRules,
  };
  return <ActiveTabContext.Provider value={val} {...props} />;
};

const useActiveTabContext = () => {
  const context = useContext(ActiveTabContext);
  if (!context) {
    throw new Error(
      `useActiveTabContext must be used within a ActiveTabContextProvider`
    );
  }
  return context;
};

export { ActiveTabContextProvider, useActiveTabContext };
