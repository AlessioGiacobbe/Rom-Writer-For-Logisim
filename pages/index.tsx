import Head from "next/head"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { Layout } from "@/components/layout"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
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

export default function IndexPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [instructionsNumber, setInstructionsNumber] = useState(256)
  const [maxMicroinstructions, setMaxMicroinstructions] = useState(16)

  const [instructionsArray, setInstructionsArray] = useState(null)
  const [selectedInstruction, setSelectedInsutrction] = useState(null)


  useEffect(() => {
    setDialogOpen(true)
  }, [])

  function dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  function saveModal() {
    if (instructionsNumber > 0 && maxMicroinstructions > 0) {
      setDialogOpen(false)
      let instructionsArray = [...Array(instructionsNumber)].map(e => Array(maxMicroinstructions).fill(3));
      setSelectedInsutrction(0)
      setInstructionsArray(instructionsArray)
    }
  }

  return (
    <Layout>
      <section className="container  grid items-center gap-6 pt-6 pb-8 md:py-10">
        <div className="grid  grid-rows-12 grid-flow-col gap-4">
          <div className="col-span-1 flex flex-1 flex-col justify-between">
            <div>
              <Select onValueChange={(e) => setSelectedInsutrction(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Istruzione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {
                      instructionsArray != null && instructionsArray.map((value, index) => <SelectItem value={index}>{index} (0x{index.toString(16)})</SelectItem>)
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid align-bottom mt-3 max-w-sm items-center gap-3.5">
              <Button>Importa ROM</Button>
              <Button>Esporta ROM</Button></div>
          </div>
          <div className="col-span-11">
            {
              selectedInstruction != null && instructionsArray != null && instructionsArray[selectedInstruction].map((value, index) => <BinaryEditor />)
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
