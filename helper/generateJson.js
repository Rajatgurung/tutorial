const csvtojson = require("./csvtojson");
const fs = require("fs")

function replacer(key, value) {
  if(value instanceof Map) {
    return Array.from(value.entries()).map((el,i) => ({
        time:el[0],
        population:el[1]
      }));
  } else {
    return value;
  }
}

async function main(){
    const json = await csvtojson("../data/Population.csv","./popdata.json")
    const population = require(json)

    const yearlyTotalPoulation = new Map();
    population.forEach(element => {
        if(+element.Time <= 2021) {
        const totalPop =  (yearlyTotalPoulation.get(element.Time) || 0) + parseInt(element.PopTotal)
          yearlyTotalPoulation.set(element.Time,totalPop)
        }
    });
    fs.writeFileSync("../data/populationByYear.json",JSON.stringify(yearlyTotalPoulation,replacer,4));
    fs.unlink(json,(err)=> {if(err)console.log(err)})
}

main()