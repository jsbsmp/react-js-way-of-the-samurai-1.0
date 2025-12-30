import { render, screen } from "@testing-library/react";
import Paginator from "./Paginator";

describe("Paginator Component tests", () => {
    test("pages count is 11 but should be showed only 10", () => {
        render(<Paginator totalItemsCount={11} currentPage={1} pageSize={1} portionSize={10} />);
        const pageNumberElements = screen.getAllByText(/\d+/);
        expect(pageNumberElements.length).toBe(10);
    });

    test("if pages count is more than 10, button NEXT should be present", () => {
        render(<Paginator totalItemsCount={11} currentPage={1} pageSize={1} portionSize={10} />);
        const nextButton = screen.getByRole('button', { name: /next/i });
        expect(nextButton).toBeInTheDocument();
    });

    test("if pages count is 10 or less, button NEXT should not be present", () => {
        render(<Paginator totalItemsCount={10} currentPage={1} pageSize={1} portionSize={10} />);
        const nextButton = screen.queryByRole('button', { name: /next/i });
        expect(nextButton).toBeNull();
    });
});