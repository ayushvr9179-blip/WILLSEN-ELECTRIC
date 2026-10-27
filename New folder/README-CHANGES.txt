WILLSEN ELECTRICS - Updated Project

WHAT CHANGED
- Complete visual redesign with a cleaner, responsive light theme.
- Existing Dashboard, Dispatch, Sales, Shop Stock, History, and Reports pages retained.
- Low-stock threshold and WhatsApp destination settings added to Shop Stock.
- Low-stock statuses and dashboard counts use the configured threshold.
- Option to prepare a WhatsApp message listing products below the threshold.
- Optional browser notifications while the website is open (grant permission in the browser).
- Fixed the report logo path and removed a duplicate legacy dispatch script that conflicted with dispatch handling.

HOW TO USE LOW-STOCK ALERTS
1. Open shop-stock.html.
2. In Low-stock message alerts, set the threshold (for example 10).
3. Enter the destination WhatsApp number with country code, digits only is recommended (India: 91 followed by the 10-digit number).
4. Select WhatsApp message draft and save settings.
5. Click Prepare low-stock message. WhatsApp opens with the message prefilled; review it and press Send.

IMPORTANT LIMITATION
This is a static browser-based app and its data is stored in localStorage on the device/browser. A web page alone cannot send WhatsApp/SMS messages automatically or while it is closed. Automatic delivery requires a secure backend and an approved WhatsApp Business/SMS provider, plus credentials kept on the server (never in frontend JavaScript).

DATA NOTE
Use the same browser and device to keep accessing existing localStorage records. Before replacing your old folder, keep a backup of your original ZIP.
