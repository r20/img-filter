import { defaultContrast, defaultGrayscale } from "./components/FilterSettings";

const insertCss = (tabId: number, css: string) => {
  try {
    return chrome.scripting.insertCSS(
      {
        target: {
          tabId: tabId,
          allFrames: true, // jmr - inject in to all frames within the tab (maybe don't need to obscure iframe if this works)
        },
        css: css,
        origin: "USER", // jmr - should we do USER?
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

const removeCss = (tabId: number, css: string) => {
  try {
    return chrome.scripting.removeCSS({
      target: {
        tabId: tabId,
        allFrames: true, // jmr - inject in to all frames within the tab (maybe don't need to obscure iframe if this works)
      },
      css: css,
      origin: "USER", // jmr - should we do USER?
    });
  } catch (err) {
    console.log("There was an error removing css for tabId", tabId, "and css", css);
    return Promise.resolve();
  }
};

const buildCss = (grayscale: number = defaultGrayscale, contrast: number = defaultContrast) => {
  const css = `img,video,iframe {filter: contrast(${contrast}%) grayscale(${grayscale}%) !important;} *[style*="background-image:"] {filter: contrast(${contrast}%) grayscale(${grayscale}%) !important;}`;
  return css;
};

// Handle when a new tab is created with a url (often it doesn't have one so this will do nothing)
chrome.tabs.onCreated.addListener((tab) => {
  const tabId = tab.id;
  if (tabId && tab.url) {
    chrome.storage.sync.get(
      {
        grayscale: defaultGrayscale,
        contrast: defaultContrast,
        isEnabled: true,
        sitesNotFiltered: [],
      },
      (items) => {
        const { grayscale, contrast, isEnabled, sitesNotFiltered } = items;

        if (isEnabled && tab.url?.startsWith("http")) {
          insertCss(tabId, buildCss(grayscale, contrast));
        }
      }
    );
  }
});

// Handle when a tab is updated with a new url (looking at changeInfo.url)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId && tab.url && changeInfo.url) {
    chrome.storage.sync.get(
      {
        grayscale: defaultGrayscale,
        contrast: defaultContrast,
        isEnabled: true,
        sitesNotFiltered: [],
      },
      (items) => {
        const { grayscale, contrast, isEnabled, sitesNotFiltered } = items;

        if (isEnabled && tab.url?.startsWith("http")) {
          insertCss(tabId, buildCss(grayscale, contrast));
        }
      }
    );
  }
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

    // If something changes, only the keys that were changed are in the changes variable.  We need more than that, so get all the values.
    chrome.storage.sync.get(
      {
        grayscale: defaultGrayscale,
        contrast: defaultContrast,
        isEnabled: true,
        sitesNotFiltered: [],
      },
      (items) => {
        const { grayscale, contrast, isEnabled, sitesNotFiltered } = items;

        let oldCssToRemove = "";
        let newCssToAdd = "";
        if (changes.isEnabled?.newValue === true) {
          // It was turned on
          newCssToAdd = buildCss(grayscale, contrast);
        } else if (changes.isEnabled?.newValue === false) {
          // It was turned off
          const oldGrayscale = changes.grayscale?.oldValue !== undefined ? changes.grayscale?.oldValue : grayscale;
          const oldContrast = changes.contrast?.oldValue !== undefined ? changes.contrast?.oldValue : contrast;
          oldCssToRemove = buildCss(oldGrayscale, oldContrast);
        } else if (isEnabled && (changes.grayscale || changes.contrast)) {
          // It was already on and something else changed
          const oldGrayscale = changes.grayscale?.oldValue !== undefined ? changes.grayscale?.oldValue : grayscale;
          const oldContrast = changes.contrast?.oldValue !== undefined ? changes.contrast?.oldValue : contrast;
          oldCssToRemove = buildCss(oldGrayscale, oldContrast);

          newCssToAdd = buildCss(grayscale, contrast);
        }

        chrome.tabs.query({}, async (tabs) => {
          // Remove old css if needed
          const promises = [];

          if (oldCssToRemove) {
            for (let idx = 0; idx < tabs.length; idx++) {
              const tabId = tabs[idx].id;
              if (tabId !== undefined && tabs[idx].url && tabs[idx].url?.startsWith("http")) {
                // Either the extension is not enabled or it is but the css changed.   Remove the old css.
                promises.push(removeCss(tabId, oldCssToRemove));
              }
            }
          }
          await promises; // If we need to insert new, we want to wait until old is removed

          // After waiting, add new css if needed
          if (newCssToAdd) {
            for (let idx = 0; idx < tabs.length; idx++) {
              const tabId = tabs[idx].id;
              if (tabId !== undefined && tabs[idx].url && tabs[idx].url?.startsWith("http")) {
                // It was enabled, or it was already enabled and the css changed.
                promises.push(insertCss(tabId, newCssToAdd));
              }
            }
          }
        });
      }
    );
  }
});
