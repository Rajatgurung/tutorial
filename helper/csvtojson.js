
const fs = require("fs");
const readline = require('readline');

module.exports = async (path,outputPath) => {
    const csv = fs.createReadStream(path);
    const json = fs.createWriteStream(outputPath,{ encoding: "utf8"});
    let readHeader = false
    let firstLine = false
    let header = []
    return new Promise((resolve,rejct)=>{
        json.on('ready',() => {
            const reader = readline.createInterface({
                input: csv,
                terminal: false,
                historySize: 0
              });
              reader.on("line",(data) => {
                const lineData = data.split(",")
                if(!readHeader && data) {
                    firstLine = true
                    readHeader = true;
                    header = lineData
                    json.write("[\n")
                }
                else if(data){
                    let obj = {}
                    header.forEach((h,i) => {obj[h] = lineData[i]})
                    const item = `${!firstLine ? ",\n":""}`+ JSON.stringify(obj,null,4)
                    firstLine = false
                    json.write(item)
                }
            })
            reader.on("close",() => {
                json.write("\n]",(err)=>{
                    resolve(outputPath)   
                })
            })
        })
    })
   
    
    
}