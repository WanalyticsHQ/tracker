((window) => {
  const {
    screen: { width, height },
    navigator: { language },
    location,
    localStorage,
    document,
    history,
  } = window;

  const { hostname, pathname, search } = location;
  const { currentScript } = document;
  if (!currentScript) return;

  const website = currentScript.getAttribute("website");
  if (!website) {
    console.error("No website provided");
  }

  const assign = (a, b) => {
    Object.keys(b).forEach(key => {
      if (b[key] !== undefined) a[key] = b[key];
    });
    return a;
  };

  const currentUrl = `${pathname}${search}`;
  let currentRef = document.referrer;
  let cache;


  const getPayload = () => ({
    s: website,
    w: width,
    r: currentRef,
    p: currentUrl,
  });

  const collect = (payload) => {
    return fetch(`http://app.wanalytics.test/api/events`, {
      method: "POST",
      body: JSON.stringify(payload),
      redirect: "follow",
      headers: assign(
        { "Content-Type": "application/json" },
        { ["x-cache"]: cache }
      ),
    });
    // .then((res) => res.text())
    // .then((text) => (cache = text))
  };

  const trackView = (url = currentUrl, r = currentRef, websiteUuid = website) =>
    collect(
      assign(getPayload(), {
        e: 'PAGEVIEW',
      }),
    );
  trackView()
})(window);
