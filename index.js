#!/usr/bin/env node
//@ts-check

import { promises as fs } from 'fs'
import path from 'path'
import mime from 'mime'
import { Command } from 'commander'

const program = new Command()

program.name("ls-csv")
program.version("0.1.3", "-v, --version")
program.option("-p, --path <paths...>", "add target directory", /** @type {any} */(["."]))
program.option("-f, --filter <types...>", "filter files by mime types", /** @type {any} */([]))
program.option("--no-header ", "no csv header")
program.parse()


/** 
 * @type {LSOptions}
 */
const opts = (program.opts())

console.error("opts", opts)

!(async () =>
{
    /**
     * @type {{date: number, csv: string}[]}
     */
    const results = []

    for (const target of opts.path)
    {
        const files = (await fs.readdir(target)).map(x => path.resolve(target, x))
        for (const file of files)
        {
            try
            {
                const fileStat = await fs.stat(file)
                if (fileStat.isFile())
                {
                    const ext = path.extname(file)
                    const mimeType = mime.getType(ext)

                    if (opts.filter.length > 0 && !opts.filter.some(x => mimeType != null && mimeType.includes(x)))
                    {
                        continue
                    }
                    results.push({
                        date: fileStat.mtime.getTime(),
                        csv: getCsvDate(fileStat.mtime) + ", " + path.basename(file) + ", " + fileStat.size
                    })
                }
            }
            catch (error)
            {
                // Ignore
            }
        }
    }

    const output = results.sort((a, b) => a.date - b.date)

    if (!opts.NoHeader)
    {
        console.log("Date, ", "Name, ", "Size")
    }

    output.forEach(x => console.log(x.csv))
})()


/**
 * Formats date to yyyy-mm-dd hh:mm:ss.sss
 * @param {Date} date 
 */
function getCsvDate(date)
{
    return `${date.getFullYear()}`
        + `-${(date.getMonth() + 1).toString().padStart(2, "0")}`
        + `-${date.getDate().toString().padStart(2, "0")}`
        + ` ${date.getHours().toString().padStart(2, "0")}`
        + `:${date.getMinutes().toString().padStart(2, "0")}`
        + `:${date.getSeconds().toString().padStart(2, "0")}`
        + `.${date.getMilliseconds().toString().padStart(3, "0")}`
}