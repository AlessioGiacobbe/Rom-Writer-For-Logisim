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
import useTranslation from 'next-translate/useTranslation'
import { Icon } from "@radix-ui/react-select"

export function BinaryEditor({ index, currentValue, setValue, onSelect, selectedMicroinstructions }) {
  const { t } = useTranslation('index')
  const [numericValue, setNumericValue] = useState(0);


  useEffect(() => {
    let currentValueAsNumber = numbers_string_to_number(currentValue)
    setNumericValue(currentValueAsNumber)
  }, [currentValue]);

  const isSelected = selectedMicroinstructions.includes(index)

  return <div  className={`grid w-full ${isSelected && "dark:shadow-cool-white-border-and-shadow shadow-cool-black-border-and-shadow bg-[#00000005] dark:bg-[#FFFFFF05]"} p-2 rounded-lg mt-3 items-center gap-3.5`} >
    <div className="grid grid-cols-12">
      <div className="col-span-11">
        <Label htmlFor={"binary_editor" + index}>{t('micro_instruction')} {index + 1} {numericValue > 0 && <>(0x{numericValue.toString(16)})</>}</Label>
      </div>
      <div className="col-span-1">
        {
          isSelected ?
          <Icons.circleDot onClick={() => onSelect(index)} className="w-3 float-right top-0 right-0 cursor-pointer"></Icons.circleDot>
          :
          <Icons.circle onClick={() => onSelect(index)} className="w-3 float-right top-0 right-0 cursor-pointer"></Icons.circle>
        }
      </div>
    </div>
    <Input name={"binary_editor" + index} value={currentValue} className="w-full" onChange={(e) => setValue(index, e.target.value)}></Input>
  </div>
}
