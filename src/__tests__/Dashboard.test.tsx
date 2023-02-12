import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Dashboard from '../renderer/pages/Dashboard';
import { format } from 'date-fns';

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
    const seconds = 1675639572;

    fireEvent.change(epochInput, { target: { value: seconds } });
    const date = new Date(seconds * 1000);
    const expectDate = format(date, 'yyyy-MM-dd');
    const dateInput = screen.getByTestId('dateInput');
    expect(dateInput).toHaveValue(expectDate);
    const expectedTime = format(date, 'HH:mm:ss');
    const timeInput = screen.getByTestId('timeInput');
    expect(timeInput).toHaveValue(expectedTime);
  });

  it('changes epoch time when date input is changed', () => {
    render(<Dashboard />);
    const seconds = 1675639572;
    const date = new Date(seconds * 1000);
    const inputDate = format(date, 'yyyy-MM-dd');
    const dateInput = screen.getByTestId('dateInput');
    fireEvent.change(dateInput, { target: { value: inputDate } });
    const epochInput = screen.getByTestId('epochInput');
    expect(Number((epochInput as HTMLInputElement).value)).toBeGreaterThan(
      seconds - 86400
    );
    expect(Number((epochInput as HTMLInputElement).value)).toBeLessThan(
      seconds + 86400
    );
  });

  it('changes epoch time when time input is changed', () => {
    render(<Dashboard />);
    const initialEpochInput = screen.getByTestId('epochInput');
    const seconds = 1675639572;
    const date = new Date(seconds * 1000);
    fireEvent.change(initialEpochInput, { target: { value: seconds } });
    const timeInput = screen.getByTestId('timeInput');
    fireEvent.change(timeInput, { target: { value: '18:35:10' } });
    date.setHours(18);
    date.setMinutes(35);
    date.setSeconds(10);
    const epochInput = screen.getByTestId('epochInput');
    expect(epochInput).toHaveValue(date.getTime() / 1000);
  });

  it('should load with the epoch input in focus', () => {
    render(<Dashboard />);
    const epochInput = screen.getByTestId('epochInput');
    expect(epochInput).toHaveFocus();
  });
});
