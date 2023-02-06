import { useEffect, useRef, useState } from 'react';
import { format, utcToZonedTime } from 'date-fns-tz';
import { format as Format, parse } from 'date-fns';
import { Box, Container, Heading, Input, Text } from '@chakra-ui/react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './dashboard.css';

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(document?.hidden);
  const [time, setTime] = useState(Math.floor(Date.now() / 1000));

  const timeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible) {
      setTime(Math.floor(Date.now() / 1000));
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
      const date = new Date(time * 1000);
      return format(date, 'MMMM d, yyyy h:mm:ss a z');
    } catch {
      return '';
    }
  }

  function getUtcTimeString() {
    try {
      const date = new Date(time * 1000);
      const utcDate = utcToZonedTime(date, 'UTC');
      return `${format(utcDate, 'MMMM d, yyyy h:mm:ss a')} UTC`;
    } catch {
      return '';
    }
  }

  function getDateInputFormatted() {
    const date = new Date(time * 1000);
    return Format(date, 'yyyy-MM-dd');
  }

  function getTimeInputFormatted() {
    const date = new Date(time * 1000);
    return Format(date, 'HH:mm:ss');
  }

  function handleDateSelected(date: Date) {
    const newDate = new Date(date);
    const currentTime = new Date(time * 1000);
    newDate.setHours(currentTime.getHours());
    newDate.setMinutes(currentTime.getMinutes());
    newDate.setSeconds(currentTime.getSeconds());
    setTime(newDate.getTime() / 1000);
  }

  function handleDateInputChange(value: string) {
    if (!value) return;
    const currentDate = new Date(time * 1000);
    const newDate = parse(value, 'yyyy-MM-dd', new Date());
    newDate.setHours(currentDate.getHours());
    newDate.setMinutes(currentDate.getMinutes());
    newDate.setSeconds(currentDate.getSeconds());
    setTime(newDate.getTime() / 1000);
  }

  function handleTimeInputChange(value: string) {
    debugger;
    if (!value) return;
    const [hours, minutes, seconds] = value.split(':');
    const currentDate = new Date(time * 1000);
    currentDate.setHours(Number(hours));
    currentDate.setMinutes(Number(minutes));
    currentDate.setSeconds(Number(seconds));
    setTime(currentDate.getTime() / 1000);
  }

  return (
    <Container padding="4" gap="2">
      <Box padding="2">
        <Heading size="sm">Epoch Converter</Heading>
      </Box>

      <Box padding="2">
        <Input
          data-testid="epochInput"
          id="time"
          value={time}
          onChange={(e) => {
            setTime(Number(e.target.value));
          }}
          type="number"
          autoFocus
          ref={timeRef}
          onFocus={(e) => e.target.select()}
        />
      </Box>

      <Box
        padding="2"
        lineHeight="150%"
        noOfLines={2}
        alignItems="center"
        justifyContent="center"
      >
        <Text data-testid="localeString" fontSize="sm">
          {getLocalTimeString()}
        </Text>
        <Text data-testid="utcString" fontSize="sm">
          {getUtcTimeString()}
        </Text>
      </Box>

      <div data-testid="dayPickerCalendar">
        <DayPicker
          selected={new Date(time * 1000)}
          style={{ display: 'flex' }}
          mode="single"
          month={new Date(time * 1000)}
          onSelect={(e) => handleDateSelected(e || new Date())}
        />
      </div>

      <Box style={{ display: 'flex', flexDirection: 'row' }}>
        <Input
          data-testid="dateInput"
          value={getDateInputFormatted()}
          placeholder="Select Date and Time"
          size="md"
          type="date"
          onChange={(e) => handleDateInputChange(e?.target?.value)}
        />
        <Input
          data-testid="timeInput"
          value={getTimeInputFormatted()}
          step="1"
          placeholder="Select Date and Time"
          size="md"
          type="time"
          onChange={(e) => handleTimeInputChange(e?.target?.value)}
        />
      </Box>
    </Container>
  );
};
export default Dashboard;
