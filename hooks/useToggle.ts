import { useState } from "react";

const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = (): void => {
    setValue(!value);
  };

  return [value, toggle];
};

export default useToggle;
