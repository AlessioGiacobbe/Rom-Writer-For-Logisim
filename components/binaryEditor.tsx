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
import { numbers_string_to_number } from "@/lib/utils"


export function BinaryEditor({ index, currentValue, setValue }) {
  const [numericValue, setNumericValue] = useState(0);


  useEffect(() => {
    let currentValueAsNumber = numbers_string_to_number(currentValue)
    setNumericValue(currentValueAsNumber)
  }, [currentValue]);


  return <div className="grid w-full mt-3 max-w-sm items-center gap-3.5">
    <Label htmlFor={"binary_editor" + index}>Microistruzione {index + 1} {numericValue > 0 && <>(0x{numericValue.toString(16)})</>}</Label>
    <Input name={"binary_editor" + index} value={currentValue} className="w-full" onChange={(e) => setValue(index, e.target.value)}></Input>
  </div>
}
