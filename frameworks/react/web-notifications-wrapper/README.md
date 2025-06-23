# Web Notifications Wrapper

Project that bundles all the dependencies of the OpenFin Web Notification Center into a single file.

It exposes a single React provider component which you can wrap your application with to enable the Notification Center for React projects.

You must get a reference to the `fin` api from the connect() function of core-web, then pass it in as a prop. 

``` typescript
return (
  <NotificationsProvider finApi={finApi}>
    <h1>My application</h1>
  </NotificationsProvider>
);
```

### Required CSS

CSS for the notification center is not bundled, so needs to be added to the consuming app:

```css
#notification_center_container {
  position: fixed;
  width: 345px;
  height: 100dvh;
  right: 0;
  top: 0;
  align-self: center;
  z-index: 100;
}
```
