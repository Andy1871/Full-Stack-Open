import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("./services/anecdotes", () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import anecdoteService from "./services/anecdotes";
import {
  useAnecdoteStore,
  useAnecdotes,
  useFilter,
  useAnecdotesActions,
} from "./store";

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  vi.clearAllMocks();
});

describe("useAnecdoteActions", () => {
  it("initialise loads anecdotes from service", async () => {
    const mockAnecdotes = [{ id: 1, content: "This is a test note", votes: 3 }];
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    const { result } = renderHook(() => useAnecdotesActions());

    await act(async () => {
      await result.current.initialize();
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current).toEqual(mockAnecdotes);
  });

  it("ensures that voting increases the number of votes for an anecdote", async () => {
    const mockAnecdotes = [{ id: 1, content: "This is a test note", votes: 3 }];
    useAnecdoteStore.setState({ anecdotes: mockAnecdotes });
    anecdoteService.update.mockResolvedValue({ ...mockAnecdotes[0], votes: 4 });

    const { result } = renderHook(() => useAnecdotesActions());

    await act(async () => {
      await result.current.vote(1);
    });

    expect(anecdoteService.update).toHaveBeenCalledWith(1, {
      ...mockAnecdotes[0],
      votes: 4,
    });

    const { result: anecdotesResult } = renderHook(() => useAnecdotes());
    expect(anecdotesResult.current[0].votes).toBe(4);
  });
});

describe("useAnecdotes", () => {
  const anecdotes = [
    { id: 1, content: "This is a test note with 3 votes", votes: 3 },
    { id: 2, content: "This is a test note with 10 votes", votes: 10 },
    { id: 3, content: "This is a test note with 5 votes", votes: 5 },
  ];

  it("returns anecdotes sorted by votes - descending", () => {
    useAnecdoteStore.setState({ anecdotes });

    const { result } = renderHook(() => useAnecdotes());
    expect(result.current).toEqual([anecdotes[1], anecdotes[2], anecdotes[0]]);
  });

  it("returns anecdotes matching the filter", () => {
    useAnecdoteStore.setState({ anecdotes, filter: "with 5 votes" });

    const { result } = renderHook(() => useAnecdotes());
    expect(result.current).toEqual([anecdotes[2]]);
  });
});
