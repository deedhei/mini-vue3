import { watchEffect, reactive } from "./reactive.js";
import { h, mount as mounts, patch } from "./render.js";
function createApp(rootComponent) {
  return {
    mount(selector) {
      const container = document.querySelector(selector);
      let isMounted = false;
      let oldVNode = null;
      watchEffect(function () {
        if (!isMounted) {
          oldVNode = rootComponent.render();
          mounts(oldVNode, container);
          isMounted = true;
        } else {
          const newVNode = rootComponent.render();
          patch(oldVNode, newVNode);
          oldVNode = newVNode;
        }
      });
    },
  };
}
export { watchEffect, reactive, h, mounts, patch, createApp };
