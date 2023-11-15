import React, { useEffect, useState, useCallback } from "react";
import { checkUrlEligibility } from "../utilities";

/** activeTab has the chomre.tabs.Tab object of the current active tab, activeEligibleHostname and activeEligibleUrl.
 * The activeEligible* strings are the hostname and url if eligible for filtering (else they are empty string).  */
const useActiveTab = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);

  let activeEligibleHostname = "";
  let activeEligibleUrl = "";
  if (checkUrlEligibility(activeTab?.url)) {
    activeEligibleUrl = activeTab?.url as string;
    const urlObj = new URL(activeTab?.url as string);
    activeEligibleHostname = urlObj.hostname;
  }

  console.log(
    "jmr - activeEligibleHostname",
    activeEligibleHostname,
    activeTab
  );

  // For simplicity use the same function for both listeners that doesn't take any arguments. The listener signature has args and it'll be passed args but ignore them.
  const queryActiveTab = useCallback(() => {
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      setActiveTab(tab);
    })();
  }, []);

  useEffect(() => {
    // Get initial active tab
    queryActiveTab();

    // If active tab changes, update
    chrome.tabs.onActivated.addListener(queryActiveTab);
    chrome.tabs.onUpdated.addListener(queryActiveTab);
    // cleanup
    return () => {
      chrome.tabs.onActivated.removeListener(queryActiveTab);
      chrome.tabs.onUpdated.removeListener(queryActiveTab);
    };
  }, []);

  return { activeTab, activeEligibleHostname, activeEligibleUrl };
};

export default useActiveTab;
