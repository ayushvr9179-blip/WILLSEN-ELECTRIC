/* WILLSEN low-stock alerts. Works with the browser's local data. */
(function () {
  const SETTINGS_KEY = "lowStockAlertSettings";
  const defaultSettings = { threshold: 10, phone: "", mode: "whatsapp" };
  function getSettings() {
    try { return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}) }; }
    catch { return { ...defaultSettings }; }
  }
  function getLowStockItems() {
    const stock = JSON.parse(localStorage.getItem("shopStock") || "{}");
    const settings = getSettings();
    return Object.entries(stock).filter(([, item]) => Number(item.quantity) < Number(settings.threshold))
      .map(([code, item]) => ({ code, name: item.name || code, quantity: Number(item.quantity) || 0 }));
  }
  function makeMessage(items) {
    const settings = getSettings();
    return `WILLSEN ELECTRICS - LOW STOCK ALERT\n\n${items.map(i => `${i.code} | ${i.name}: ${i.quantity} left`).join("\n")}\n\nPlease arrange replenishment. Alert threshold: below ${settings.threshold}.`;
  }
  function openWhatsApp() {
    const settings = getSettings();
    const items = getLowStockItems();
    if (!items.length) { alert(`No products are below the threshold (${settings.threshold}).`); return; }
    if (!settings.phone || !/^\d{10,15}$/.test(settings.phone.replace(/[+\s()-]/g, ""))) {
      alert("Please enter a valid WhatsApp number with country code, then save settings."); return;
    }
    const phone = settings.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(makeMessage(items))}`, "_blank", "noopener");
  }
  function notifyIfNeeded() {
    const items = getLowStockItems();
    const currentSignature = items.map(i => `${i.code}:${i.quantity}`).join("|");
    const previousSignature = sessionStorage.getItem("willsenLowStockSignature") || "";
    sessionStorage.setItem("willsenLowStockSignature", currentSignature);
    const settings = getSettings();
    if (items.length && currentSignature !== previousSignature && settings.mode === "browser" && "Notification" in window) {
      if (Notification.permission === "granted") new Notification("WILLSEN: Low stock", { body: items.slice(0, 5).map(i => `${i.name}: ${i.quantity} left`).join("\n") });
    }
  }
  window.WillsenLowStock = { getSettings, getLowStockItems, makeMessage, openWhatsApp, notifyIfNeeded };
})();
