import Router from "next/router";

const ignorePaths = ["/signin", "/signin", "/refresh"];

const replace = (href, as) => {
  if (!process.browser) {
    // eslint-disable-next-line
    console.warn("You should only use i18nRouter inside the client side of your app.");
    return null;
  }

  const source = location.pathname.split("/")[1];

  if (href === "/") {
    return Router.replace("/[source]", `/${source}`);
  }

  if (ignorePaths.includes(href)) {
    return Router.replace(href);
  }

  if (!as) {
    return Router.replace(`/[source]${href}`, `/${source}${href}`);
  }

  Router.replace(`/[source]${href}`, `/${source}${as}`);

  return null;
};

const push = (href, as) => {
  if (!process.browser) {
    // eslint-disable-next-line no-console
    console.warn("You should only use i18nRouter inside the client side of your app.");
    return null;
  }

  const source = location.pathname.split("/")[1];

  if (href === "/") {
    return Router.push("/[source]", `/${source}`);
  }

  if (ignorePaths.includes(href)) {
    return Router.push(href);
  }

  if (!as) {
    return Router.push(`/[source]${href}`, `/${source}${href}`);
  }

  Router.push(`/[source]${href}`, `/${source}${as}`);

  return null;
};

export default {
  replace,
  push,
  back: () => Router.back()
};
