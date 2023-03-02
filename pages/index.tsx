import Head from "next/head"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogContentWithoutClose, DialogHeader, } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useEffect, useRef, useState } from "react"
import _ from 'lodash';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BinaryEditor } from "@/components/binaryEditor"
import { addOrRemove, dec2bin, isEmpty, isNumeric, numbers_string_to_hex_number, numbers_string_to_number } from "@/lib/utils"
import {
  useTranslation,
  useLanguageQuery,
  LanguageSwitcher,
} from "next-export-i18n";

export default function IndexPage() {
  const { t } = useTranslation('index')

  const [dialogOpen, setDialogOpen] = useState(false)
  const [instructionsNumber, setInstructionsNumber] = useState(256)
  const [maxMicroinstructions, setMaxMicroinstructions] = useState(16)

  const [instructionsArray, setInstructionsArray] = useState(null)
  const [selectedInstruction, setSelectedInstruction] = useState(null)
  const [selectedMicroinstructions, setSelectedMicroinstructions] = useState([])

  const [globalAdd, setGlobalAdd] = useState(0)
  const [globalRemove, setGlobalRemove] = useState(0)

  const inputFile = useRef(null)

  useEffect(() => {
    setDialogOpen(true)
  }, [])

  function toggleSelectedMicrosintruction(microInstructionNumber) {
    let selectedMicroinstructionsClone = _.clone(selectedMicroinstructions)
    addOrRemove(selectedMicroinstructionsClone, microInstructionNumber)
    setSelectedMicroinstructions(selectedMicroinstructionsClone)
  }

  function global_add() {
    let instructionsClone = _.clone(instructionsArray)
    if (globalAdd < 32 && globalAdd >= 0) {
      instructionsClone[selectedInstruction] = instructionsClone[selectedInstruction].map((microInstruction, index) => {
        if (!microInstruction.includes(globalAdd)) {
          if (selectedMicroinstructions.length) {
            if (selectedMicroinstructions.includes(index)) {
              microInstruction += ` ${globalAdd.toString()}`
            }
          } else {
            microInstruction += ` ${globalAdd.toString()}`
          }
          return microInstruction
        }

        return microInstruction
      })
      setInstructionsArray(instructionsClone)
    }
  }

  function global_remove() {
    let instructionsClone = _.clone(instructionsArray)
    if (globalRemove < 32 && globalRemove >= 0) {
      instructionsClone[selectedInstruction] = instructionsClone[selectedInstruction].map((microInstruction, index) => {
        if (microInstruction.includes(globalRemove.toString())) {
          if (selectedMicroinstructions.length) {
            if (selectedMicroinstructions.includes(index)) {
              microInstruction = microInstruction.replace(globalRemove, "")
            }
          } else {
            microInstruction = microInstruction.replace(globalRemove, "")
          }
          return microInstruction
        }
        return microInstruction
      })
      setInstructionsArray(instructionsClone)
    }
  }

  function export_rom() {
    let exportText = "v2.0 raw\n";
    let emptyCount = 0;
    instructionsArray.forEach(instruction => {
      instruction.forEach(microInstruction => {
        if (isEmpty(microInstruction)) {
          emptyCount++
        } else {
          if (emptyCount > 0) {
            exportText += `${emptyCount}*0 `
            emptyCount = 0;
          }
          exportText += `${numbers_string_to_hex_number(microInstruction)} `
        }
      });
    });

    const blob = new Blob([exportText], { type: "text/text;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "export";
    link.href = url;
    console.log(link.href);
    link.click();
  }

  function importFile(event) {
    let file = event.target.files[0];
    let reader = new FileReader()
    reader.onload = async (e) => {
      const text = (e.target.result).toString().replace("v2.0 raw", "").replace(/\n/g, " ")
      parseNumbersArray(text.split(" "))
    };
    reader.readAsText(file)
  }

  function parseNumbersArray(array) {
    let instructionsArrayOffset = 0;
    let newArray = [...Array(instructionsNumber)].map(e => Array(maxMicroinstructions).fill(''));

    array.forEach(number => {
      if (number != "" && number != " ") {
        if (number.includes("*")) {
          //value is compressed with 0*value
          let splittedNumber = number.split("*")
          let quantity = splittedNumber[0];
          let value = splittedNumber[1];
          _.range(quantity).forEach(_ => {
            let instructionNumber = Math.floor(instructionsArrayOffset / maxMicroinstructions);
            let microInstructionNumber = Math.floor(instructionsArrayOffset % maxMicroinstructions);
            newArray[instructionNumber][microInstructionNumber] = value != 0 ? value : ""
            instructionsArrayOffset++
          });
        } else {
          let instructionNumber = Math.floor(instructionsArrayOffset / maxMicroinstructions);
          let microInstructionNumber = Math.floor(instructionsArrayOffset % maxMicroinstructions);
          let numberAsInt = parseInt(number, 16)
          let numberAsBinary = dec2bin(numberAsInt);
          let valueAsNumbersString = "";

          numberAsBinary.split('').reverse().forEach((character, index) => {
            if (character == '1') {
              valueAsNumbersString += (index + " ")
            }
          });

          newArray[instructionNumber][microInstructionNumber] = valueAsNumbersString
          instructionsArrayOffset++
        }
      }
    });

    setInstructionsArray(newArray)
  }

  function saveModal() {
    if (instructionsNumber > 0 && maxMicroinstructions > 0) {
      setDialogOpen(false)
      let instructionsArray = [...Array(instructionsNumber)].map(e => Array(maxMicroinstructions).fill(''));
      setSelectedInstruction(0)
      setInstructionsArray(instructionsArray)
    }
  }

  function setValueInInstructionsArray(microInstructionIndex, value) {
    let currentInstructions = _.clone(instructionsArray);
    currentInstructions[selectedInstruction][microInstructionIndex] = value;
    setInstructionsArray(currentInstructions)
  }

  const halfInstructionsArray = instructionsArray ? Math.ceil(instructionsArray[selectedInstruction].length / 2) : null

  return (
    <Layout>
      <Head>
        <title>β Rom Writer</title>
      </Head>
      <section className="container  grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="grid grid-cols-12  grid-flow-col gap-4">
          <div className="col-span-3 flex flex-1 flex-col justify-between min-h-80vh">
            <div>
              <div className="grid w-full mt-3 items-center gap-3.5">
                <Label htmlFor="instruction_select">{t('instruction')}</Label>
                <Select name="instruction_select" value={selectedInstruction} onValueChange={(e) => setSelectedInstruction(e)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Istruzione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        instructionsArray != null && instructionsArray.map((value, index) => <SelectItem key={index} value={index}>{index} (0x{index.toString(16)})</SelectItem>)
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="inline-block	w-full">
                <Label className="my-2" htmlFor="global_add">{
                  selectedMicroinstructions.length ?
                    t('add_to_selected_microinstructions')
                    :
                    <>
                      {t('add_to_all_microinstructions')} {selectedInstruction ?? ""} (0x{selectedInstruction != null ? selectedInstruction.toString(16) : ""})
                    </>
                }</Label>
                <Input className="my-2" name="global_add" value={globalAdd} type="number" min="0" max="31" onChange={(e) => {
                  if (isNumeric(e.target.value)) {
                    let number = parseInt(e.target.value, 10)
                    if (number >= 0) {
                      setGlobalAdd(number)
                    }
                  }
                }}></Input>
                <Button className="text-right my-2 float-right mb-5" onClick={global_add}>{t('add')}</Button>
              </div>


              <div >
                <Label className="my-2" htmlFor="global_remove">{
                  selectedMicroinstructions.length ?
                    t('remove_from_selected_microinstructions')
                    :
                    <>
                      {t('remove_from_all_microinstructions')} {selectedInstruction ?? ""} (0x{selectedInstruction != null ? selectedInstruction.toString(16) : ""})
                    </>
                }</Label>
                <Input className="my-2" name="global_remove" value={globalRemove} type="number" min="0" max="31" onChange={(e) => {
                  if (isNumeric(e.target.value)) {
                    let number = parseInt(e.target.value, 10)
                    if (number >= 0) {
                      setGlobalRemove(number)
                    }
                  }
                }}></Input>
                <Button className="text-right my-2 float-right mb-5" onClick={global_remove}>{t('remove')}</Button>
              </div>
            </div>

            <div className="grid align-bottom mt-3  items-center gap-3.5">
              <input type='file' id='file' ref={inputFile} onChange={importFile} style={{ display: 'none' }} />
              <Button onClick={() => inputFile.current.click()}>{t('import_rom')}</Button>
              <Button onClick={export_rom}>{t('export_rom')}</Button>
            </div>
          </div>
          <div className="max-h-80vh col-span-10 grid-cols-2 grid gap-4 pr-4 overflow-auto overflow-x-hidden">
            <div>
              {
                selectedInstruction != null && instructionsArray != null && instructionsArray[selectedInstruction].slice(0, halfInstructionsArray).map((value, index) => <BinaryEditor onSelect={toggleSelectedMicrosintruction} selectedMicroinstructions={selectedMicroinstructions} key={index} index={index} currentValue={value} setValue={setValueInInstructionsArray} />)
              }
            </div>
            <div>
              {
                selectedInstruction != null && instructionsArray != null && instructionsArray[selectedInstruction].slice(halfInstructionsArray).map((value, index) => <BinaryEditor onSelect={toggleSelectedMicrosintruction} selectedMicroinstructions={selectedMicroinstructions} key={index + halfInstructionsArray} index={index + halfInstructionsArray} currentValue={value} setValue={setValueInInstructionsArray} />)
              }
            </div>
          </div>
        </div>
        <Dialog
          open={dialogOpen}
        >
          <DialogContentWithoutClose>
            <DialogHeader>
              <DialogTitle>{t('size_modal_title')}</DialogTitle>
              <DialogDescription>
                <div className="grid w-full mt-3 items-center gap-3.5ub">
                  <Label htmlFor="instructions_number">{t('instructions_number')}</Label>
                  <Input value={instructionsNumber} onChange={(e) => setInstructionsNumber(Number(e.target.value))} type="number" id="instructions_number" min="1" placeholder="256" />
                </div>
                <div className="grid w-full mt-3 items-center gap-3.5ub">
                  <Label htmlFor="max_microinstructions_number">{t('max_microinstructions_number')}</Label>
                  <Input value={maxMicroinstructions} min="1" onChange={(e) => setMaxMicroinstructions(Number(e.target.value))} type="number" id="max_microinstructions_number" placeholder="16" />
                </div>
                <Button onClick={saveModal} className="mt-5 text-right  float-right mb-5">{t('save')}</Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContentWithoutClose>
        </Dialog>
      </section>
    </Layout>
  )
}
