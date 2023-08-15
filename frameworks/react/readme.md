# React

Contained in this folder are samples for the following patterns.

* [container](./container) - A platform built using the OpenFin container technology.
* [workspace](./workspace) - A platform which demonstrates implementing an OpenFin workspace platform and interacting with its components.
* [view](./view) - A simple view pattern which demonstrates using the OpenFin API in a react app.

## Container

For a guide on how this example was created see [create-container.md](./creating-container.md)

When you execute this example with `npm run start`, the following will launch your system browser (this is the `container/src/App.tsx` content).

![Container Browser](./container-browser.png)

If you then run `npm run client` it will start the platform instead, you should see the following.

![Container Platform](./container-platform.png)

The platform window content is the [./container/src/platform/Provider.tsx](./container/src/platform/Provider.tsx) which also initializes the platform.

The window with the two views are the [./container/src/views/View1.tsx](./container/src/views/View1.tsx) and [./container/src/views/View2.tsx](./container/src/views/View2.tsx) components.

These components demonstrate the following:

* Displaying a notification
* Broadcasting/listening for FDC3 contexts between views
