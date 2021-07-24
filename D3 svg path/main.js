
import * as d3 from "d3"
import data from "../data/populationByYear.json"

const height = 500
const width = 960
const padding = { top: 20, right: 30, bottom: 65, left: 90 }

const graphWidth = width - padding.left - padding.right
const grapHeight = height - padding.bottom - padding.top



const svg = d3.select("body").append("svg").style("height", height).style("width", width)

data.forEach(el => {
  el.time = new Date(el.time)
  el.data = el.population
})


const getX = (d) => d.time
const getY = (d) => d.data

const scaleX = d3.scaleTime()
  .domain(d3.extent(data, getX))
  .range([0, graphWidth])
  .nice()

const xTickFormat = d3.timeFormat('%Y')

const scaleY = d3.scaleLinear()
  .domain(d3.extent(data, getY))
  .range([grapHeight, 0])
  .nice()

const yTickFormat = d3.format(".2s")


const line = d3.line()
  .x(d => scaleX(getX(d)))
  .y(d => scaleY(getY(d)))
  .curve(d3.curveNatural)(data)

const graphContainer = svg.append("g").attr("transform",`translate(${padding.left},${padding.bottom})`)



scaleY.ticks().map(tick =>{
  const tickContainer =  graphContainer.append("g").attr("transform", `translate(0,${scaleY(tick)})`)
    tickContainer.append("line").style("stroke","#C0C0BB").attr("x2", graphWidth)
    tickContainer.append('text').text(yTickFormat(tick)).attr("x",-45).attr("dy",".32em")
  })

scaleX.ticks().map(tick =>{
  const tickContainer =  graphContainer.append("g").attr("transform", `translate(${scaleX(tick)},0)`)
    tickContainer.append("line").style("stroke","#C0C0BB").attr("y2", grapHeight)
    tickContainer.append('text').text(xTickFormat(tick)).attr("y",grapHeight + 20).attr("x",-20)
  })


  graphContainer.append("g").append("path").attr("d", line)
                .style("fill","none")
                .style("stroke","#137B80")
                .style("stroke-width",4)
                .style("stroke-linejoin","round")
                .style("stroke-linecap","round")