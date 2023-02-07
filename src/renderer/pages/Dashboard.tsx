import { useEffect, useRef, useState } from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';
import { parse } from 'date-fns';
import { Box, Container, Heading, Input, Text } from '@chakra-ui/react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './dashboard.scss';
import DateStringInput from '../components/DateStringInput';

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(document?.hidden);
  const [date, setDate] = useState(new Date());

  const timeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible) {
      setDate(new Date());
    }
  }, [isVisible]);

  const onVisibilityChange = () => {
    const hidden = document?.hidden;
    setIsVisible(hidden);
    timeRef?.current?.focus();
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange, false);

    return () => {
      document?.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  function getLocalTimeString() {
    try {
      return format(date, 'MMMM d, yyyy h:mm:ss a z');
    } catch {
      return '';
    }
  }

  function getUtcTimeString() {
    try {
      const utcDate = utcToZonedTime(date, 'UTC');
      return `${format(utcDate, 'MMMM d, yyyy h:mm:ss a')} UTC`;
    } catch {
      return '';
    }
  }

  function getDateInputFormatted() {
    return format(date, 'yyyy-MM-dd');
  }

  function getTimeInputFormatted() {
    return format(date, 'HH:mm:ss');
  }

  function handleDateSelected(newDate: Date) {
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    newDate.setSeconds(date.getSeconds());
    setDate(newDate);
  }

  function handleDateInputChange(value: string) {
    if (!value) return;
    const newDate = parse(value, 'yyyy-MM-dd', new Date());
    newDate.setHours(date.getHours());
    newDate.setMinutes(date.getMinutes());
    newDate.setSeconds(date.getSeconds());
    setDate(newDate);
  }

  function handleTimeInputChange(value: string) {
    if (!value) return;
    const [hours, minutes, seconds] = value.split(':');
    const newDate = new Date(date);
    newDate.setHours(Number(hours));
    newDate.setMinutes(Number(minutes));
    newDate.setSeconds(Number(seconds));
    setDate(newDate);
  }

  function dateToSeconds() {
    return Math.floor(date.getTime() / 1000);
  }

  return (
    <Container className="container">
      <Box className="groupWrapper">
        <Heading size="sm">Epoch Converter</Heading>
      </Box>

      <Box className="groupWrapper">
        <Input
          data-testid="epochInput"
          id="time"
          value={dateToSeconds()}
          onChange={(e) => {
            setDate(new Date(Number(e.target.value) * 1000));
          }}
          type="number"
          autoFocus
          ref={timeRef}
          onFocus={(e) => e.target.select()}
        />
      </Box>

      <Box className="groupWrapper stringSectionWrapper">
        <DateStringInput value={getLocalTimeString()} dataTest="localeString" />
        <DateStringInput value={getUtcTimeString()} dataTest="utcString" />
      </Box>

      <div data-testid="dayPickerCalendar">
        <DayPicker
          selected={date}
          className="calendar"
          mode="single"
          month={date}
          onSelect={(e) => handleDateSelected(e || new Date())}
        />
      </div>

      <Box className="dateTimeInput">
        <Input
          data-testid="dateInput"
          value={getDateInputFormatted()}
          size="md"
          type="date"
          onChange={(e) => handleDateInputChange(e?.target?.value)}
        />
        <Input
          data-testid="timeInput"
          value={getTimeInputFormatted()}
          step="1"
          size="md"
          type="time"
          onChange={(e) => handleTimeInputChange(e?.target?.value)}
        />
      </Box>
    </Container>
  );
};
export default Dashboard;
