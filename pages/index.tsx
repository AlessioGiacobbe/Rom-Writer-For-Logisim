import Head from "next/head"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, } from "@/components/ui/dialog"
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
import { isEmpty, numbers_string_to_hex_number, numbers_string_to_number } from "@/lib/utils"

export default function IndexPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [instructionsNumber, setInstructionsNumber] = useState(256)
  const [maxMicroinstructions, setMaxMicroinstructions] = useState(16)

  const [instructionsArray, setInstructionsArray] = useState(null)
  const [selectedInstruction, setSelectedInsutrction] = useState(null)

  const inputFile = useRef(null)

  useEffect(() => {
    setDialogOpen(true)
  }, [])

  function dec2bin(dec) {
    return (dec >>> 0).toString(2);
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

    const blob = new Blob([exportText]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "export";
    link.href = url;
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
      setSelectedInsutrction(0)
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
        <div className="grid  grid-rows-12 grid-flow-col gap-4">
          <div className="col-span-1 flex flex-1 flex-col justify-between min-h-3/4">
            <div>
              <div className="grid w-full mt-3 max-w-sm items-center gap-3.5">
                <Label htmlFor="instruction_select">Istruzione</Label>
                <Select name="instruction_select" value={selectedInstruction} onValueChange={(e) => setSelectedInsutrction(e)}>
                  <SelectTrigger className="w-[180px]">
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

            <div className="grid align-bottom mt-3 max-w-sm items-center gap-3.5">
              <input type='file' id='file' ref={inputFile} onChange={importFile} style={{ display: 'none' }} />
              <Button onClick={() => inputFile.current.click()}>Importa ROM</Button>
              <Button onClick={export_rom}>Esporta ROM</Button>
            </div>
          </div>
          <div className="col-span-6">
            {
              selectedInstruction != null && instructionsArray != null && instructionsArray[selectedInstruction].slice(0, halfInstructionsArray).map((value, index) => <BinaryEditor key={index} index={index} currentValue={value} setValue={setValueInInstructionsArray} />)
            }
          </div>
          <div className="col-span-6">
            {
              selectedInstruction != null && instructionsArray != null && instructionsArray[selectedInstruction].slice(halfInstructionsArray).map((value, index) => <BinaryEditor key={index + halfInstructionsArray} index={index + halfInstructionsArray} currentValue={value} setValue={setValueInInstructionsArray} />)
            }
          </div>
        </div>
        <Dialog
          open={dialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quanto è grande la ROM?</DialogTitle>
              <DialogDescription>
                <div className="grid w-full mt-3 max-w-sm items-center gap-3.5">
                  <Label htmlFor="instructions_number">Numero istruzioni</Label>
                  <Input value={instructionsNumber} onChange={(e) => setInstructionsNumber(Number(e.target.value))} type="number" id="instructions_number" placeholder="256" />
                </div>
                <div className="grid w-full mt-3 max-w-sm items-center gap-3.5">
                  <Label htmlFor="max_microinstructions_number">Numero massimo microistruzioni</Label>
                  <Input value={maxMicroinstructions} onChange={(e) => setMaxMicroinstructions(Number(e.target.value))} type="number" id="max_microinstructions_number" placeholder="16" />
                </div>
                <Button onClick={saveModal} className="mt-3">Salva</Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </section>
    </Layout>
  )
}
