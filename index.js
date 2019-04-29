dataset = dataset.slice(15, 65)

const margin = 60;
const width = 1000 - 2 * margin;
const height = 600 - 2 * margin;
const maxValence = 1

const div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const svg = d3.select('svg')
const chart = svg.append('g')
.attr('transform', `translate(${margin}, ${margin})`);

svg.append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2.4)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .attr("class", "label")
    .text('Valence')

svg.append('text')
    .attr('x', width / 2 + margin)
    .attr('y', 650)
    .attr('text-anchor', 'middle')
    .attr("class", "label")
    .text('Artist')

const colorScale = d3.scaleLinear()
.domain([0, maxValence])
.range(["#fa0000", "#16ff0a"])

const yScale = d3.scaleLinear()
.domain([0, maxValence])
.range([height, 0])

chart.append('g')
.call(d3.axisLeft(yScale));

const xScale = d3.scaleBand()
.range([0, width])
.domain(dataset.map((d) => d.artists))
.padding(0.1)

chart.append('g')
.attr('transform', `translate(0, ${height})`)
.call(d3.axisBottom(xScale))
.selectAll("text")
.style("text-anchor", "end")
.attr("dx", "-.8em")
.attr("dy", "0em")
.attr("transform", "rotate(-45)")

chart.selectAll()
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d.artists))
    .attr('y', (d) => yScale(d.valence))
    .attr('height', (d) => height - yScale(d.valence))
    .attr('width', xScale.bandwidth())
    .attr("fill", ({ valence }) => {
      return colorScale(valence)
    })
    .on("mouseover", function ({ id, artists, name, valence }, i) {
      div.transition()
          .duration(200)
          .style("opacity", .9);
      div.html(
        "Artist: " + artists + "<br/>" +
        "Title: " + name + "<br/>" +
        "Valence: <b>" + valence + "</b><br/>"
        )
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      d3.select(this).style('fill', 'yellow')
    })
    .on("mouseout", function ({ valence }, i) {
      d3.select(this).style('fill', colorScale(valence))
    })
