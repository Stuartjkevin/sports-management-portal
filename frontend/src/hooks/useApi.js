import { useEffect, useState } from 'react';

// Loads data from the API and tracks loading / error state.
// Usage: const { data, loading, error, reload } = useApi(() => teamService.list(), []);
// The request runs again whenever a value in `deps` changes, or when reload() is called.
export default function useApi(request, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false; // ignore late answers after the page changed
    setState((prev) => ({ ...prev, loading: true, error: null }));
    request()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (!cancelled) setState({ data: null, loading: false, error }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { ...state, reload: () => setReloadKey((k) => k + 1) };
}
