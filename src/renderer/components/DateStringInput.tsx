import { Input } from '@chakra-ui/react';
import { FC } from 'react';

interface DateStringInputProps {
  value: string;
  dataTest: string;
}

const DateStringInput: FC<DateStringInputProps> = ({ value, dataTest }) => {
  return (
    <Input
      data-testid={dataTest}
      size="sm"
      fontSize="sm"
      style={{ userSelect: 'text', border: 'none' }}
      onClick={(e) => {
        (e.target as HTMLInputElement).select();
      }}
      readOnly
      value={value}
    />
  );
};

export default DateStringInput;
