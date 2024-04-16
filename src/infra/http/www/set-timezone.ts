try {
  const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();
  document.cookie = `timezone=${timeZone}; path=/;`;
  document.cookie = `locale=${locale}; path=/;`;
} catch {}
