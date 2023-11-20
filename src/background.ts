import { FilterLevel, IStoredDataRules, IStoredDataOther } from "./types";
import { checkUrlEligibility, getMatchingRules } from "./utilities";

const insertCss = (tabId: number, css: string) => {
  try {
    return chrome.scripting.insertCSS(
      {
        target: {
          tabId: tabId,
          // allFrames: true, // jmr - inject in to all frames within the tab (maybe don't need to obscure iframe if this works)
        },
        css: css,
        origin: "USER",
      },
      () => {
        // do nothing
      }
    );
  } catch (err) {
    console.log(
      "There was an error inserting css for tabId",
      tabId,
      "and css",
      css
    );
    return Promise.resolve();
  }
};

const removeCss = (tabId: number, css: string) => {
  try {
    return chrome.scripting.removeCSS({
      target: {
        tabId: tabId,
        // allFrames: true, // jmr - inject in to all frames within the tab (maybe don't need to obscure iframe if this works)
      },
      css: css,
      origin: "USER",
    });
  } catch (err) {
    console.log(
      "There was an error removing css for tabId",
      tabId,
      "and css",
      css
    );
    return Promise.resolve();
  }
};

const buildCss = (imgLevel: FilterLevel, iframeLevel: FilterLevel) => {
  let imgGrayscale, iframeGrayscale, imgContrast, iframeContrast;
  if (imgLevel === FilterLevel.None) {
    imgGrayscale = 0;
    imgContrast = 100;
  } else if (imgLevel === FilterLevel.Low) {
    imgGrayscale = 50;
    imgContrast = 50;
  } else if (imgLevel === FilterLevel.Medium) {
    imgGrayscale = 90;
    imgContrast = 15;
  } else {
    // Doesn't matter what grayscale is
    imgGrayscale = 50;
    imgContrast = 0;
  }

  if (iframeLevel === FilterLevel.None) {
    iframeGrayscale = 0;
    iframeContrast = 100;
  } else if (iframeLevel === FilterLevel.Low) {
    iframeGrayscale = 50;
    iframeContrast = 50;
  } else if (iframeLevel === FilterLevel.Medium) {
    iframeGrayscale = 90;
    iframeContrast = 15;
  } else {
    // Doesn't matter what grayscale is
    iframeGrayscale = 50;
    iframeContrast = 0;
  }
  const css = `iframe {filter: contrast(${iframeContrast}%) grayscale(${iframeGrayscale}%) !important;} img,video {filter: contrast(${imgContrast}%) grayscale(${imgGrayscale}%) !important;} *[style*="background-image:"] {filter: contrast(${imgContrast}%) grayscale(${imgGrayscale}%) !important;}`;
  return css;
};

interface IInsertedCssMap {
  [key: string]: string;
}
/* This will hold css that has been inserted and can be used to remove it */
let insertedCssMap: IInsertedCssMap = {};

const setCss = (tab: chrome.tabs.Tab) => {
  const defaults: IStoredDataRules & IStoredDataOther = {
    generalImgLevel: FilterLevel.Low,
    generalIframeLevel: FilterLevel.Medium,
    isEnabled: true,
    customRulesArray0to49: [],
    customRulesArray50to99: [],
    customRulesArray100to149: [],
  };

  chrome.storage.sync.get(defaults, (items) => {
    const {
      generalImgLevel,
      generalIframeLevel,
      isEnabled,
      customRulesArray0to49,
      customRulesArray50to99,
      customRulesArray100to149,
    } = items;

    const customRulesArray = [
      ...customRulesArray0to49,
      ...customRulesArray50to99,
      ...customRulesArray100to149,
    ];

    if (tab && tab.id && checkUrlEligibility(tab.url)) {
      const matchingRules = getMatchingRules(
        tab.url as string,
        customRulesArray
      );

      /* Use the last matching rule.  That's how they are displayed to users too. */
      const lastMatch = matchingRules.length
        ? matchingRules[matchingRules.length - 1]
        : null;
      const imgLevel =
        lastMatch?.imgLevel !== undefined
          ? lastMatch?.imgLevel
          : generalImgLevel;
      const iframeLevel =
        lastMatch?.iframeLevel !== undefined
          ? lastMatch?.iframeLevel
          : generalIframeLevel;

      const newCss = buildCss(imgLevel, iframeLevel);
      const oldCss = insertedCssMap[tab.id] || "";

      if (oldCss) {
        /* If there's old remove it. Don't bother waiting for remove (which is an async operation).
          I think it's ok to add other css before remove is finished. */
        removeCss(tab.id, oldCss);
        delete insertedCssMap[tab.id];
      }

      if (isEnabled) {
        /* It's on add it. I used to try to not remove and re-add if css is the same,
          but there were times when a page was loading and it'd get set then somehow disappear from the page after
          an onChange event for loading and it'd need set again.
          (This happened when refreshing stackoverfow sites.) */
        insertCss(tab.id, newCss);
        insertedCssMap[tab.id] = newCss;
      }
    }
  });
};

/* Handle when a tab is updated with a new url or reloaded or status otherwise cahnges. */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId && tab.url && (changeInfo.url || changeInfo.status === "loading")) {
    /* Call setCss which will try to remove old css 
      (which is sometimes needed and sometimes not, such as a new URL).
      It's OK if it tries to remove first and it wasn't needed.
      Then it will add the new css. */
    setCss(tab);
  }
});

// Initially, get the active tab and apply css if needed
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // since only one tab should be active and in the current window at once
  // the return variable should only have one entry
  var tab = tabs[0];
  setCss(tab);
});

// Handle when the active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    setCss(tab);
  });
});

// Handle when the settings in storage change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === "sync") {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        `Storage key "${key}" in namespace "${namespace}" changed.`,
        `Old value was "${oldValue}", new value is "${newValue}".`
      );
    }

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      // since only one tab should be active and in the current window at once the return variable should only have one entry
      var tab = tabs[0];
      setCss(tab);
    });
  }
});

// jmr - consider using chrome.action.setIcon to change the icon to show whether filtering is on or off (maybe also eligble or not eligible)
