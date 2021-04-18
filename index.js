//@ts-check

import fs, { statSync } from 'fs'
import path from 'path'
import mime from 'mime'
import { Command } from 'commander'

const program = new Command()

program.name("ls-csv")
program.version('0.1.1', "-v, --version")
// @ts-ignore
program.option("-p, --path <paths...>", "Add target directory", ["."])
// @ts-ignore
program.option("-f, --filter <types...>", "Filter files by mime types", [])
program.parse()

/** 
 * @type {LSOptions}
 */
const opts = (program.opts())

// console.error("opts", opts)

/**
 * @type {{date: number, csv: string}[]}
 */
const results = []

for (const target of opts.path)
{
    const files = fs.readdirSync(target).map(x => path.resolve(target, x))
    for (const file of files)
    {
        const fileStat = fs.statSync(file)
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
}

const output = results.sort((a, b) => a.date - b.date)

output.forEach(x => console.log(x.csv))


/**
 * 
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