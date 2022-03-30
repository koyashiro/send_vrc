(() => {
  const defaultMethod = "POST";
  const toVRC = (receiveUrl: string, method: string = defaultMethod) => {
    const url = urlReplace(receiveUrl);
    fetch("http://localhost:11400/url", {
      method: method,
      mode: "cors",
      credentials: "omit",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    })
      .then((res) => {
        if (!res.ok && method !== "PUT") {
          toVRC(url, "PUT");
        }

        if (!res.ok && method === "PUT") {
          window.alert("please start send_vrc_desktop.");
        }
      })
      .catch((e) => {
        console.log(e, method);
        // old version compatible.
        if (method !== "PUT") {
          toVRC(url, "PUT");
        }
        if (method === "PUT") {
          window.alert("please start send_vrc_desktop.");
        }
      });
  };
  const getClipboard = () => {
    const pasteTarget = document.createElement("div");
    pasteTarget.contentEditable = "true";
    if (!document.activeElement) {
      throw new Error("`document.activeElement` is null");
    }
    const activeElement = document.activeElement.appendChild(pasteTarget).parentNode;
    pasteTarget.focus();
    document.execCommand("Paste");
    const paste = pasteTarget.innerText;
    if (!activeElement) {
      throw new Error("`activeElement` is null")
    }
    activeElement.removeChild(pasteTarget);
    return paste;
  };

  const urlReplace = (url: string) => {
    const u = new URL(url);
    switch (u.hostname) {
      case "youtube.com":
      case "www.youtube.com":
      case "m.youtube.com": {
        const v = u.searchParams.get("v");
        const allowURL = new URL("https://www.youtube.com/watch");
        if (v) {
          allowURL.searchParams.append("v", v);
        }
        return allowURL.toString();
      }
      default:
        return u.toString();
    }
  };

  chrome.contextMenus.create({
    title: "SendVRC this page",
    type: "normal",
    contexts: ["page"],
    onclick: (info) => {
      if (!info || !info["pageUrl"]) {
        return;
      }
      const pageURL = info["pageUrl"];
      toVRC(pageURL);
    },
  });

  chrome.contextMenus.create({
    title: "SendVRC with clipboard",
    type: "normal",
    contexts: ["browser_action"],
    onclick: () => {
      toVRC(getClipboard());
    },
  });

  chrome.browserAction.onClicked.addListener((e) => {
    if (!e || !e["url"]) {
      return;
    }
    toVRC(e["url"]);
  });
})();
