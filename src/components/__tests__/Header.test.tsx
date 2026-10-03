import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Header, { type HeaderLabels, type MenuItem, type LocaleLink } from "../Header";

jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = "MockNextLink";
  return { __esModule: true, default: MockLink };
});

jest.mock("@/components/ThemeToggle", () => ({
  ThemeToggle: ({ label }: { label: string }) => <button aria-label={label}>Theme Toggle</button>,
}));
jest.mock("@/components/TopDrawerMenu", () => ({ __esModule: true, default: () => <div>TopDrawerMenu</div> }));
jest.mock("@/components/NavMenu", () => ({ MainNav: () => <div>MainNav</div> }));
jest.mock("../Logo", () => ({ __esModule: true, default: () => <div>Logo</div> }));

const labels: HeaderLabels = {
  siteName: "PizzaNote",
  overview: "Overview",
  search: "Search",
  menu: "Menu",
  language: "Language",
  theme: "Toggle theme",
  searchTitle: "Search posts",
  searchPlaceholder: "Type a keyword",
  searchLoading: "Loading...",
  searchEmpty: "No matching posts",
  searchHint: "Type a keyword to search",
  close: "Close",
};

const menu: MenuItem[] = [{ title: "Posts", links: "/en/posts/", content: [] }];

const localeLinks: LocaleLink[] = [
  { code: "zh-TW", label: "中文", href: "/zh-tw/", current: false },
  { code: "en", label: "English", href: "/en/", current: true },
];

const index = [
  { title: "First Post", description: "This is the first post.", href: "/en/front-end/first-post/" },
  { title: "Second Post", description: "A second post about React.", href: "/en/front-end/second-post/" },
];

const renderHeader = () =>
  render(
    <Header
      homeHref="/en/"
      searchIndexUrl="/en/search-index.json"
      menu={menu}
      labels={labels}
      localeLinks={localeLinks}
    />,
  );

describe("Header", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => index }) as unknown as typeof fetch;
  });

  it("links the logo to the locale home and marks the current language", () => {
    renderHeader();
    expect(screen.getAllByRole("link").some((a) => a.getAttribute("href") === "/en/")).toBe(true);
    expect(screen.getAllByText("English")[0]).toHaveAttribute("aria-current", "true");
    expect(screen.getAllByText("中文")[0].closest("a")).toHaveAttribute("href", "/zh-tw/");
  });

  it("does not fetch the search index until search is opened", () => {
    renderHeader();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fetches the index once on first open and filters by title or description", async () => {
    renderHeader();
    fireEvent.click(screen.getAllByLabelText("Search")[0]);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith("/en/search-index.json");

    const input = await screen.findByPlaceholderText("Type a keyword");
    fireEvent.change(input, { target: { value: "react" } });

    expect(await screen.findByText("Second Post")).toBeInTheDocument();
    expect(screen.queryByText("First Post")).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    renderHeader();
    fireEvent.click(screen.getAllByLabelText("Search")[0]);
    const input = await screen.findByPlaceholderText("Type a keyword");
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    fireEvent.change(input, { target: { value: "zzz" } });
    expect(await screen.findByText("No matching posts")).toBeInTheDocument();
  });
});
