import React from 'react';

const
  BaseUrl      = `https://raw.githubusercontent.com`,
  Owner        = `jokorone`,
  Repo         = `interactive-paper-graph`,
  SourceBranch = `develop`,
  Location     = `docs`,
  ContentURL   = `${BaseUrl}/${Owner}/${Repo}/${SourceBranch}/${Location}` as const;


export const useFetch = (query: string) => {
  const
    cache = React.useRef<{ [contentId: string]: string }>({}),

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
