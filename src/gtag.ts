export const pageview = (url: string, title: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: url,
      page_title: title,
    });
  }
};
