#!/usr/bin/env node

/*
 * CSV to JSON converter
 * This application installs
 * This way we can invoke the program in multiple ways, e.g.:
 * $ node csv-to-json.js file_to_convert.csv
 * $ ./csv-to-json.js file_to_convert.csv (Requires execute permissions on POSIX, e.g. chmod +x csv-to-json.js)
 * $ csv-to-json file_to_convert.csv
 * 
 * Or we can use it as a standalone module via the `convert' export.
 */

const csv = require('csvtojson')
const fs = require('fs')
const path = require('path')
const readline = require('readline')


if (require.main === module) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    if (process.argv.length > 2) {
        convert_csv(process.argv[2])
    } else {
        rl.question('Please enter the path to the CSV file: ', filepath => {
            convert_csv(filepath)
            rl.close()
        })
    }
}

function convert_csv(csvfile) {
    const file = path.parse(csvfile)
    if (file.ext != '.csv') {
        // Super basic file checking
        throw `Error: Input file ${csvfile} must have the .csv extension!`
    }
    
    // The output has the same name as the input file, but with .json extension
    const outfile = `${file.name}.json`
    
    // Data store for our JSON objects.
    let data = []
    
    csv().fromFile(csvfile)
    .on('json', obj => {
        // TODO: Write the JSON object directly to preserve memory
        data.push(obj)
    })
    .on('done', err => {
        if (err) {
            console.error(`CSV error: ${err}`)
        } else {
            fs.writeFile(
                outfile,
                JSON.stringify(data),
                err => {
                    if (err)
                        console.error(`Unable to write ${outfile}: ${err.message}`)
                }
            )
        }
    })
}

module.exports.convert = convert_csv
