import { createContext, useContext, useCallback } from 'react';

export type HarperDBContextType = {
  url: string;
  user: string;
  password: string;
};
export type HarperDBProviderProps = {
  url: string;
  user: string;
  password: string;
  children: JSX.Element;
};
export const HarperDBContext = createContext<Partial<HarperDBContextType>>({});

export const HarperDBProvider = ({
  url,
  user,
  password,
  children,
}: HarperDBProviderProps) => {
  return (
    <HarperDBContext.Provider value={{ user, password, url }}>
      {children}
    </HarperDBContext.Provider>
  );
};
export function useHarperDB() {
  const { url, user, password } = useContext(HarperDBContext);
  let abortController: AbortController;

  const executeQuery = useCallback(
    async ({ stringifiedQuery, signal }) => {
      try {
        const request = await fetch(`${url}`, {
          method: 'POST',
          signal,
          body: stringifiedQuery,
          headers: {
            'Content-Type': 'application/json',
            authorization: `Basic ${btoa(`${user}:${password}`)}`,
          },
        });

        const json = await request.json();
        const response = json.body || json;

        if (response.error) {
          return { error: response.message };
        }

        return { data: response };
      } catch (e: any) {
        return { error: e.message };
      }
    },
    [url, user, password]
  );
  const execute = async (sqlQuery: { operation: string; sql: string }) => {
    abortController = new AbortController();
    const queryBody = JSON.stringify(sqlQuery);
    const response = await executeQuery({
      stringifiedQuery: queryBody,
      signal: abortController.signal,
    });
    return response;
  };
  return { execute };
}
