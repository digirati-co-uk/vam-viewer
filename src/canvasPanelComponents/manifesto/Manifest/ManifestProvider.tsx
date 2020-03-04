import { createContext } from '../../utility/create-context';
import { Manifest } from 'manifesto.js';
import React, { useEffect, useState } from 'react';
import { parseManifest } from '../../utility/parse-manifest';

const [useManifest, InternalManifestProvider] = createContext<Manifest>();

export type ManifestProviderProps = {
  url?: string;
  locale?: string;
  fetchOptions?: any;
  jsonLd?: any;
};

export { useManifest };

export const ManifestProvider: React.FC<ManifestProviderProps> = ({
  url,
  locale = 'en-GB',
  fetchOptions,
  jsonLd,
  children,
}) => {
  const [error, setError] = useState<string>();
  const [manifest, setManifest] = useState<Manifest>();

  useEffect(() => {
    if (jsonLd) {
      setManifest(parseManifest(jsonLd, { locale }));
      return;
    }
    if (url) {
      fetch(url, fetchOptions || { cache: 'force-cache' })
        .then(j => j.json())
        .then(fetchedJsonLd => {
          setManifest(parseManifest(fetchedJsonLd, { locale }));
        })
        .catch(() => {
          setError('Something went wrong fetching this manifest.');
        });
    }
  }, [fetchOptions, jsonLd, locale, url]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!manifest) {
    return <></>;
  }

  return (
    <InternalManifestProvider value={manifest}>
      {children}
    </InternalManifestProvider>
  );
};
