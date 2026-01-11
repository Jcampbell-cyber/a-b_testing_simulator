export const pageview = (url: string, title: string) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
    });
  }
};
