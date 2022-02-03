import React from 'react';

const
  BaseUrl = `https://raw.githubusercontent.com` as const,
  Owner = `jokorone` as const,
  Repo = `interactive-paper-graph` as const,
  SourceBranch = `develop` as const,
  Location = `docs` as const,
  ContentURL = `${BaseUrl}/${Owner}/${Repo}/${SourceBranch}/${Location}` as const;


export const useFetch = (query: string) => {
  const
    cache = React.useRef<{ [url: string]: string }>({}),

    [ status, setStatus ] = React.useState<'fetching' | 'fetched'>(),
    [ content, setContent ] = React.useState<string>('');

  const url = (file: string) => `${ContentURL}/${file}.md`;


  React.useEffect(() => {
    const fetchContent = async () => {
      setStatus('fetching');

      if (cache.current[query]) {

        const data = cache.current[query];
        setStatus('fetched');
        setContent(data);

      } else {

        const res = await fetch(url(query));
        const _content = await res.text();
        setStatus('fetched');
        cache.current[query] = _content;
        setContent(_content);

      }
    }

    fetchContent();
  }, [query]);

  return { status, content }
}
