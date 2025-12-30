import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ProfileStatus from './ProfileStatus';

describe("ProfileStatus Component", () => {
  test("status from props should be displayed in the component", () => {
    render(<ProfileStatus status="My status" updateStatus={jest.fn()} />);
    const statusElement = screen.getByText(/My status/i);
    expect(statusElement).toBeInTheDocument();
  });

  test("after creation <span> should be displayed with correct status", () => {
    const { container } = render(<ProfileStatus status="My status" updateStatus={jest.fn()} />);
    const spanElement = container.querySelector('span');
    expect(spanElement).toBeInTheDocument();
    expect(spanElement!.textContent).toBe("My status");
  });

  test("input should be displayed in editMode after double click", () => {
    render(<ProfileStatus status="My status" updateStatus={jest.fn()} />);
    const statusElement = screen.getByText(/My status/i);
    fireEvent.doubleClick(statusElement);
    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
    expect((inputElement as HTMLInputElement).value).toBe("My status");
  });

  test("callback should be called when status is updated", () => {
    const mockUpdateStatus = jest.fn();
    render(<ProfileStatus status="My status" updateStatus={mockUpdateStatus} />);
    const statusElement = screen.getByText(/My status/i); 
    fireEvent.doubleClick(statusElement);
    const inputElement = screen.getByRole("textbox");
    fireEvent.blur(inputElement);
    expect(mockUpdateStatus).toHaveBeenCalledTimes(1);
  });
});