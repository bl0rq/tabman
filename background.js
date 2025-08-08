// Background script responsible for regrouping tabs by domain.
// It exposes a message listener so the popup can trigger regrouping on demand.

// Load shared utilities like normalizeUrl
importScripts('url-utils.js');

/**
 * Regroup all tabs across all windows by their domain name.
 * Duplicate URLs (after normalization) are ignored.
 */
async function regroupTabs() {
  const tabs = await chrome.tabs.query({});

  // Remove duplicate URLs
  const uniqueTabs = new Map();
  for (const tab of tabs) {
    if (!tab.url) continue;
    const normalized = normalizeUrl(tab.url);
    if (!uniqueTabs.has(normalized)) {
      uniqueTabs.set(normalized, tab);
    }
  }

  // Group tabs by domain and window
  const domainMap = new Map(); // hostname => Map(windowId => tabId[])
  for (const tab of uniqueTabs.values()) {
    let hostname;
    try {
      hostname = new URL(tab.url).hostname;
    } catch {
      continue;
    }

    if (!domainMap.has(hostname)) {
      domainMap.set(hostname, new Map());
    }
    const windowMap = domainMap.get(hostname);
    if (!windowMap.has(tab.windowId)) {
      windowMap.set(tab.windowId, []);
    }
    windowMap.get(tab.windowId).push(tab.id);
  }

  // Create tab groups per domain per window
  for (const [hostname, windowMap] of domainMap.entries()) {
    for (const [windowId, tabIds] of windowMap.entries()) {
      if (tabIds.length <= 1) continue; // no need to group single tabs

      try {
        const groupId = await chrome.tabs.group({ tabIds, windowId });
        await chrome.tabGroups.update(groupId, { title: hostname });
      } catch (e) {
        console.error("Failed to group tabs", hostname, e);
      }
    }
  }
}

// Listen for messages from the popup to trigger regrouping
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.action === "regroup") {
    regroupTabs().then(() => sendResponse({ status: "completed" }));
    return true; // keep the message channel open for async response
  }
});
