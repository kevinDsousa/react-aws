import { useState, useEffect } from "react";

const AbortController = window.AbortController;

const API_BASE = import.meta.env.VITE_API_BASE;

export const defaultHeaders = {
  "Content-Type": "application/json",
};

type Method =
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "PATCH"
  | "TRACE"
  | "CONNECT"
  | "POST"
  | "PUT"
  | "DELETE";

type Options = Parameters<typeof fetch>[1];

export const useFetchApi = (
  resource: string,
  method: Method = "GET",
  options?: Options
) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const controller = new AbortController();

  const startFetch = async (body?: BodyInit) => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}${resource}`, {
        method,
        headers: {
          ...defaultHeaders,
        },
        signal: controller.signal,
        body,
        ...options,
      });

      const res = await response.json();

      if (!response.ok) {
        throw res;
      }

      setData(res);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    data,
    error,
    startFetch,
  };
};
