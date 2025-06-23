import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header from "../Header"; // Adjust path as needed
import { readClient } from "@/sanity/lib/client"; // Mock this

// Mock Sanity client
jest.mock("@/sanity/lib/client", () => ({
  readClient: {
    fetch: jest.fn(),
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  const MockLink = ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockNextLink";
  return MockLink;
});

// Mock ThemeToggle and TopDrawerMenu if they cause issues
jest.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: () => <button>Theme Toggle</button>,
}));
jest.mock("@/components/TopDrawerMenu", () => ({
  TopDrawerMenu: () => <div>TopDrawerMenu</div>,
}));
jest.mock("@/components/NavMenu", () => ({
  MainNav: () => <div>MainNav</div>,
}));
jest.mock("@/components/Logo", () => ({
  Logo: () => <div>Logo</div>,
}));

const mockPosts = [
  {
    _id: "1",
    title: "First Post",
    slug: "first-post",
    description: "This is the first post.",
    category: { title: "Category A", slug: "category-a", topic: { title: "Topic X", slug: "topic-x" } },
    publishedAt: "2023-01-01",
  },
  {
    _id: "2",
    title: "Second Post",
    slug: "second-post",
    description: "This is the second post about React.",
    category: { title: "Category B", slug: "category-b", topic: { title: "Topic Y", slug: "topic-y" } },
    publishedAt: "2023-01-02",
  },
  {
    _id: "3",
    title: "Another Article",
    slug: "another-article",
    description: "An article about Next.js.",
    category: { title: "Category A", slug: "category-a", topic: { title: "Topic X", slug: "topic-x" } },
    publishedAt: "2023-01-03",
  },
];

describe("Header Component", () => {
  beforeEach(() => {
    // Reset mocks before each test
    (readClient.fetch as jest.Mock).mockReset();
  });

  test("renders the search button", () => {
    render(<Header />);
    const searchButtons = screen.getAllByRole("button", { name: "Search" });
    expect(searchButtons.length).toBeGreaterThan(0);
  });

  test("opens and closes the search bar", async () => {
    (readClient.fetch as jest.Mock).mockResolvedValueOnce([]); // Mock fetch for opening
    render(<Header />);

    const searchButton = screen.getAllByRole("button", { name: "Search" })[0];
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("搜尋文章")).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: /✕/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("搜尋文章")).not.toBeInTheDocument();
    });
  });

  test("fetches posts and displays loading state when search bar opens", async () => {
    (readClient.fetch as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Pending promise to keep loading
    render(<Header />);

    const searchButton = screen.getAllByRole("button", { name: "Search" })[0];
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText("載入中...")).toBeInTheDocument();
    });
    expect(readClient.fetch).toHaveBeenCalledTimes(1);
  });

  test("filters posts based on search query and displays results", async () => {
    (readClient.fetch as jest.Mock).mockResolvedValueOnce(mockPosts);
    render(<Header />);

    const searchButton = screen.getAllByRole("button", { name: "Search" })[0];
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(readClient.fetch).toHaveBeenCalledTimes(1);
    });

    const searchInput = screen.getByPlaceholderText("搜尋文章");
    fireEvent.change(searchInput, { target: { value: "First" } });

    await waitFor(() => {
      const firstPostResult = screen.getByText("First Post");
      expect(firstPostResult).toBeInTheDocument();
      // Check the href of the link
      expect(firstPostResult.closest("a")).toHaveAttribute("href", "/topic-x/category-a/first-post");
      expect(screen.queryByText("Second Post")).not.toBeInTheDocument();
    });

    // Test that the search bar can be closed using its own close button
    // This is already covered by "opens and closes the search bar" test,
    // but re-asserting part of it here ensures the search results don't break it.
    const closeButton = screen.getByRole("button", { name: /✕/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("搜尋文章")).not.toBeInTheDocument();
    });
  });

  test("displays 'no results' message when no posts match query", async () => {
    (readClient.fetch as jest.Mock).mockResolvedValueOnce(mockPosts);
    render(<Header />);

    const searchButton = screen.getAllByRole("button", { name: "Search" })[0];
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(readClient.fetch).toHaveBeenCalledTimes(1);
    });

    const searchInput = screen.getByPlaceholderText("搜尋文章");
    fireEvent.change(searchInput, { target: { value: "NonExistentQuery" } });

    await waitFor(() => {
      expect(screen.getByText("找不到相關文章")).toBeInTheDocument();
    });
  });

  test("displays initial message when search query is empty after opening", async () => {
    (readClient.fetch as jest.Mock).mockResolvedValueOnce(mockPosts);
    render(<Header />);

    const searchButton = screen.getAllByRole("button", { name: "Search" })[0];
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(readClient.fetch).toHaveBeenCalledTimes(1); // Make sure fetch has completed
    });

    // The input is initially empty
    expect(screen.getByPlaceholderText("搜尋文章")).toHaveValue("");
    // Check for the initial prompt message
    expect(screen.getByText("請輸入關鍵字進行搜尋")).toBeInTheDocument();
  });

  test("clears search results when search query is cleared", async () => {
    (readClient.fetch as jest.Mock).mockResolvedValueOnce(mockPosts);
    render(<Header />);

    const searchButton = screen.getAllByRole("button", { name: "Search" })[0];
    fireEvent.click(searchButton);

    await waitFor(() => expect(readClient.fetch).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByPlaceholderText("搜尋文章");
    fireEvent.change(searchInput, { target: { value: "First" } });

    await waitFor(() => {
      expect(screen.getByText("First Post")).toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.queryByText("First Post")).not.toBeInTheDocument();
      expect(screen.getByText("請輸入關鍵字進行搜尋")).toBeInTheDocument();
    });
  });
});
