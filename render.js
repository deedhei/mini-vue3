// 实现h函数
const h = (tag, props, children) => {
  // 其实vnode就是一个js对象 =>   {}
  return {
    tag,
    props,
    children,
  };
};

// 实现挂载
const mount = (vnode, container) => {
  // vnode -> element
  // 1、创建出真实元素，并在vnode上保留el
  const el = (vnode.el = document.createElement(vnode.tag));

  // 2、处理props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];
      if (key.startsWith("on")) {
        // 对事件的监听
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  // 3、处理children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((item) => {
        mount(item, el);
      });
    }
  }
  // 4、 将el挂载到container上
  container.appendChild(el);
};

// 实现diff
const patch = (n1, n2) => {
  if (n1.tag !== n2.tag) {
    const n1ElParent = n1.el.parentElement;
    n1ElParent.removeChild(n1.el);
    mount(n2, n1ElParent);
  } else {
    // 1、去除element对象，并且n2中进行保存
    const el = (n2.el = n1.el);
    // 2、处理props
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    // 2.1 获取所有的newProps添加到el
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        if (key.startsWith("on")) {
          // 对事件的监听
          el.addEventListener(key.slice(2).toLowerCase(), newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }
    // 2.2 删除旧的props
    for (const key in oldProps) {
      if (key.startsWith("on")) {
        // 对事件的监听
        const value = oldProps[key];
        el.removeEventListener(key.slice(2).toLowerCase(), value);
      }
      if (!(key in newProps)) {
        // if (key.startsWith("on")) {
        //   // 对事件的监听
        //   const value = oldProps[key];
        //   el.removeEventListener(key.slice(2).toLowerCase, value);
        // } else {
        el.removeAttribute(key);
        // }
      }
    }
    // 3、处理children
    const oldChildren = n1.children || [];
    const newChildren = n2.children || [];
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.innerHTML = newChildren;
      }
    } else {
      // 情况二：newChildren 本身是一个数组
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
        newChildren.forEach((itme) => {
          mount(item, el);
        });
      } else {
        // oldChildren:[v1,v2,v3]
        // newChildren:[v1,v5,v6,v7,v8]
        // 1、前面有相同节点的原生进行patch操作
        const oldLength = oldChildren.length;
        const newLength = newChildren.length;
        const commonLength = Math.min(oldLength, newLength);
        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }
        // 2、oldLength < newLength
        if (oldLength < newLength) {
          // mount new
          newChildren.slice(oldLength).forEach((item) => {
            mount(item, el);
          });
        }
        // 3、oldLength > newLength
        if (oldLength > newLength) {
          // remove old
          oldChildren.slice(newLength).forEach((item) => {
            el.removeChild(item.el);
          });
        }
      }
    }
  }
};

export { h, mount, patch };
