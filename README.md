# ß-RomWriter for Logisim
A simple website to create Logisim's rom easily, previously [BetaRomWriterForLogisim](https://github.com/AlessioGiacobbe/BetaRomWriterForLogisim).
<p align="center">
<img src="https://i.imgur.com/qrudaNr.png"/>
</p>

## How it works?
Choose how many instructions and how many micro-instructions your rom bank will contain.
<p align="center">
  <img width="350px" src="https://i.imgur.com/JrgQqv7.png"/>
</p>

Then choose an instruction from the top-left select and start creating your rom writing only the bits you want to activate, for example if you want to write the instruction `1010` you can simply write `3 1`.

You can import and export ROMs into and from the website in a Logisim compatible format.

## Develop
This website is built with React and Next.js upon the [shadcn/ui](https://ui.shadcn.com/) template, to start developing it just git clone the repo and run the project with `yarn dev`.
