export const withBase = (path: string) => {
  if (!path) {
    return path;
  }

  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) {
    return path;
  }

  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;

  if (normalizedBase !== '/' && path.startsWith(normalizedBase)) {
    return path;
  }

  if (path.startsWith('/xCellence/')) {
    return `${normalizedBase}${path.replace(/^\/xCellence\//, '')}`;
  }

  if (path.startsWith('/')) {
    return `${normalizedBase}${path.replace(/^\/+/, '')}`;
  }

  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
};
