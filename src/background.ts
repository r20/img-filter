import { FilterLevel, IStoredDataRules, IStoredDataOther } from "./types";
import { checkUrlEligibility, getMatchingRules } from "./utilities";

const insertCss = (tabId: number, css: string, allFrames: boolean) => {
  console.log("jmr - insertCss", tabId, css, allFrames);
  try {
    return chrome.scripting.insertCSS(
      {
        target: {
          tabId: tabId,
          allFrames, // whether to inject in to all frames within the tab (including iframes)
        },
        css: css,
        origin: "USER",
      },
      () => {
        // do nothing
      }
    );
  } catch (err) {
    console.log("There was an error inserting css for tabId", tabId, "and css", css);
    return Promise.resolve();
  }
};

const removeCss = (tabId: number, css: string, allFrames: boolean) => {
  console.log("jmr - removeCss", tabId, css, allFrames);
  try {
    return chrome.scripting.removeCSS({
      target: {
        tabId: tabId,
        allFrames, // whether to inject in to all frames within the tab (including iframes)
      },
      css: css,
      origin: "USER",
    });
  } catch (err) {
    console.log("There was an error removing css for tabId", tabId, "and css", css);
    return Promise.resolve();
  }
};

interface ICssInfo {
  imgCss: string;
  iframeCss: string;
  isIframeOff: boolean;
}
const buildCss = (imgLevel: FilterLevel, iframeLevel: FilterLevel): ICssInfo => {
  let imgGrayscale, iframeGrayscale, imgContrast, iframeContrast;
  if (imgLevel === FilterLevel.None) {
    imgGrayscale = 0;
    imgContrast = 100;
  } else if (imgLevel === FilterLevel.Low) {
    imgGrayscale = 50;
    imgContrast = 50;
  } else if (imgLevel === FilterLevel.Medium) {
    imgGrayscale = 70;
    imgContrast = 30;
  } else if (imgLevel === FilterLevel.High) {
    imgGrayscale = 90;
    imgContrast = 15;
  } else {
    // Doesn't matter what grayscale is
    imgGrayscale = 50;
    imgContrast = 0;
  }

  let isIframeOff = false;
  if (iframeLevel === FilterLevel.None) {
    iframeGrayscale = 0;
    iframeContrast = 100;
    isIframeOff = true;
  } else if (iframeLevel === FilterLevel.Low) {
    iframeGrayscale = 50;
    iframeContrast = 50;
  } else if (iframeLevel === FilterLevel.Medium) {
    iframeGrayscale = 70;
    iframeContrast = 30;
  } else if (iframeLevel === FilterLevel.High) {
    iframeGrayscale = 90;
    iframeContrast = 15;
  } else {
    // Doesn't matter what grayscale is
    iframeGrayscale = 50;
    iframeContrast = 0;
  }
  /* To test levels, run this command in the browser debug console
  let imgs=document.getElementsByTagName("img"); for(let i=0; i<imgs.length; i++) {imgs[i].style.filter = "contrast(15%) grayscale(90%)"};
  */

  /* Have separate css for iframes and images because we want to do insertCss with allFrames false for iframes
    because sometimes ads have iframes within iframes and it makes it look darker than the selected filter.
    We still want images within iframes to be filtere. */
  const iframeCss = `iframe {filter: contrast(${iframeContrast}%) grayscale(${iframeGrayscale}%) !important;} `;
  const imgCss = `img,video {filter: contrast(${imgContrast}%) grayscale(${imgGrayscale}%) !important;} *[style*="background-image:"] {filter: contrast(${imgContrast}%) grayscale(${imgGrayscale}%) !important;}`;
  return { iframeCss, imgCss, isIframeOff };
};

interface ITabIdToCssMap {
  [key: string]: ICssInfo;
}
/* This will hold css info about what was inserted and can be used to remove it */
let tabIdToCssMap: ITabIdToCssMap = {};

const setIcon = (isOn: boolean) => {
  if (!isOn) {
    // We aren't doing filtering
    chrome.action.setIcon({
      path: {
        16: "/images/icon-off-16.png",
        32: "/images/icon-off-32.png",
        48: "/images/icon-off-48.png",
        128: "/images/icon-off-128.png",
      },
    });
  } else {
    chrome.action.setIcon({
      path: {
        16: "/images/icon-16.png",
        32: "/images/icon-32.png",
        48: "/images/icon-48.png",
        128: "/images/icon-128.png",
      },
    });
  }
};
const setCss = (tab: chrome.tabs.Tab) => {
  console.log("jmr - setCss called", tab);
  const defaults: IStoredDataRules & IStoredDataOther = {
    generalImgLevel: FilterLevel.None,
    generalIframeLevel: FilterLevel.High,
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

    const customRulesArray = [...customRulesArray0to49, ...customRulesArray50to99, ...customRulesArray100to149];

    if (tab && tab.id && checkUrlEligibility(tab.url)) {
      const matchingRules = getMatchingRules(tab.url as string, customRulesArray);

      /* Use the last matching rule.  That's how they are displayed to users too. */
      const lastMatch = matchingRules.length ? matchingRules[matchingRules.length - 1] : null;
      const imgLevel = lastMatch?.imgLevel !== undefined ? lastMatch?.imgLevel : generalImgLevel;
      const iframeLevel = lastMatch?.iframeLevel !== undefined ? lastMatch?.iframeLevel : generalIframeLevel;

      const {
        iframeCss: newIframeCss,
        imgCss: newImgCss,
        isIframeOff: newIsIframeOff,
      } = buildCss(imgLevel, iframeLevel);
      const { iframeCss: oldIframeCss, imgCss: oldImgCss, isIframeOff: oldIsIframeOff } = tabIdToCssMap[tab.id] || "";

      if (oldImgCss) {
        /* If there's old remove it. Don't bother waiting for remove (which is an async operation).
          I think it's ok to add other css before remove is finished. */
        removeCss(tab.id, oldImgCss, oldIsIframeOff);
        delete tabIdToCssMap[tab.id];
      }
      if (oldIframeCss) {
        /* If there's old remove it. Don't bother waiting for remove (which is an async operation).
          I think it's ok to add other css before remove is finished. */
        removeCss(tab.id, oldIframeCss, false);
        delete tabIdToCssMap[tab.id];
      }

      if (isEnabled) {
        /* It's on add it. I used to try to not remove and re-add if css is the same,
          but there were times when a page was loading and it'd get set then somehow disappear from the page after
          an onChange event for loading and it'd need set again.
          (This happened when refreshing stackoverfow sites.) */
        // If newIsIframeOff (no iframe filtering), set allFrames to filter images within iframes
        insertCss(tab.id, newImgCss, newIsIframeOff);
        insertCss(tab.id, newIframeCss, false);
        tabIdToCssMap[tab.id] = {
          iframeCss: newIframeCss,
          imgCss: newImgCss,
          isIframeOff: newIsIframeOff,
        };
      }
      setIcon(!(imgLevel === FilterLevel.None && iframeLevel === FilterLevel.None) && isEnabled);
    } else {
      setIcon(false);
    }
  });
};

/* Handle when a tab is updated with a new url or reloaded or status otherwise changes. */
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
    // for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    //   console.log(
    //     `Storage key "${key}" in namespace "${namespace}" changed.`,
    //     `Old value was "${oldValue}", new value is "${newValue}".`
    //   );
    // }

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      // since only one tab should be active and in the current window at once the return variable should only have one entry
      var tab = tabs[0];
      setCss(tab);
    });
  }
});
