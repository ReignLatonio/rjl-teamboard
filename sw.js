// RJL Team Board — Service Worker
// Shows a real system notification when a push arrives, even if
// this site's tab is closed. Runs in the background in the browser.

self.addEventListener("push", (event) => {
  let data = { title: "RJL Team Board", body: "You have a new notification." };
  try { data = event.data.json(); } catch (e) {}

  const options = {
    body: data.body,
    icon: data.icon || "https://rjl-teamboard.vercel.app/icon.png",
    badge: data.icon || "https://rjl-teamboard.vercel.app/icon.png",
    tag: data.tag || "rjl-notification",
    data: { url: data.url || "https://rjl-teamboard.vercel.app/" },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : "https://rjl-teamboard.vercel.app/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes("rjl-teamboard.vercel.app") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
