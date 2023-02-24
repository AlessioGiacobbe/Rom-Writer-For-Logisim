import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import _ from 'lodash';
import { Label } from "./ui/label"

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

export function BinaryEditor({ index, value, setValue }) {
  const [numericValue, setNumericValue] = useState(0);


  useEffect(() => {
    let numbersInString = value.split(" ");
    numbersInString = _.uniq(numbersInString);

    let numericValue = numbersInString.reduce(
      (accumulator, currentValue) => {

        if (isNumeric(currentValue)) {
          let currentValueAsNumber = parseInt(currentValue)
          if (currentValueAsNumber < 32 && currentValueAsNumber >= 0) {
            let shiftedValue = (1 << currentValueAsNumber) >>> 0;
            return accumulator + shiftedValue
          }
          return accumulator
        }
        return accumulator
      },
      0
    )

    setNumericValue(numericValue)
  }, [value]);


  return <div className="grid w-full mt-3 max-w-sm items-center gap-3.5">
    <Label htmlFor={"binary_editor" + index}>Istruzione {index + 1} {numericValue > 0 && <>(0x{numericValue.toString(16)})</>}</Label>
    <Input name={"binary_editor" + index} value={value} onChange={(e) => setValue(index, e.target.value)}></Input>
  </div>
}
