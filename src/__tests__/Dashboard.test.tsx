import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Dashboard from '../renderer/pages/Dashboard';

describe('Dashboard', () => {
  it('renders all the components', () => {
    render(<Dashboard />);
    const epochInput = screen.getByTestId('epochInput');
    const localeString = screen.getByTestId('localeString');
    const utcString = screen.getByTestId('utcString');
    const dayPickerCalendar = screen.getByTestId('dayPickerCalendar');
    const dateInput = screen.getByTestId('dateInput');
    const timeInput = screen.getByTestId('timeInput');
    expect(epochInput).toBeInTheDocument();
    expect(localeString).toBeInTheDocument();
    expect(utcString).toBeInTheDocument();
    expect(dayPickerCalendar).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    expect(timeInput).toBeInTheDocument();
  });

  it('renders the correct date string when the date changes', () => {
    render(<Dashboard />);
    const epochInput = screen.getByTestId('epochInput');

    fireEvent.change(epochInput, { target: { value: 1675639572 } });

    const utcString = screen.getByTestId('utcString');
    expect(utcString).toHaveValue('February 5, 2023 11:26:12 PM UTC');
  });

  it('changes date and time inputs to match the correct time', () => {
    render(<Dashboard />);
    const epochInput = screen.getByTestId('epochInput');

    fireEvent.change(epochInput, { target: { value: 1675639572 } });
    const dateInput = screen.getByTestId('dateInput');
    expect(dateInput).toHaveValue('2023-02-05');
    const timeInput = screen.getByTestId('timeInput');
    expect(timeInput).toHaveValue('17:26:12');
  });

  it('changes epoch time when date input is changed', () => {
    render(<Dashboard />);
    const dateInput = screen.getByTestId('dateInput');
    fireEvent.change(dateInput, { target: { value: '2021-05-28' } });
    const epochInput = screen.getByTestId('epochInput');
    expect(Number((epochInput as HTMLInputElement).value)).toBeGreaterThan(
      1622178000
    );
    expect(Number((epochInput as HTMLInputElement).value)).toBeLessThan(
      1622264392
    );
  });

  it('changes epoch time when time input is changed', () => {
    render(<Dashboard />);
    const initialEpochInput = screen.getByTestId('epochInput');

    fireEvent.change(initialEpochInput, { target: { value: 1675639572 } });
    const timeInput = screen.getByTestId('timeInput');
    fireEvent.change(timeInput, { target: { value: '18:35:10' } });
    const epochInput = screen.getByTestId('epochInput');
    expect(epochInput).toHaveValue(1675643710);
  });

  it('should load with the epoch input in focus', () => {
    render(<Dashboard />);
    const epochInput = screen.getByTestId('epochInput');
    expect(epochInput).toHaveFocus();
  });
});
