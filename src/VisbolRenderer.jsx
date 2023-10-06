import React from 'react'
import * as d3 from 'd3'
import './VisbolRenderer.css'

function lighter(color) {
  const lighterColor = d3.color(color)
  lighterColor.opacity = 0.15
  return lighterColor.rgb()
}

function computeTextColor(bgColor) {
  const darkText = '#151515'
  const lightText = '#FFFFFF'
  console.log(d3.color(bgColor).l)
  return d3.hsl(bgColor).l < 0.5 ? lightText : darkText
}

export const VisbolRenderer = ({ visbolSequence }) => {
  const colorScale = d3.scaleOrdinal([
    '#E8AEB7',
    '#90C1E4',
    '#85E4DC',
    '#B8E986',
    '#82E298',
    '#82ABA1',
    '#057162',
    '#E1DAC0',
    '#FFCC66',
    '#EE9F3A',
    '#FF9966',
    '#E9CA5B',
    '#BAB2FF',
    '#FDBBF9',
    '#A368A8',
    '#4F6382',
  ])

  return (
    <div style={{ display: 'flex' }}>
      {visbolSequence.map((vs, i) => {
        return <VisbolCard key={i} info={vs} colorScale={colorScale} />
      })}
    </div>
  )
}

const VisbolCard = ({ info, colorScale }) => {
  const { name, identifier, orientation, role } = info

  const infoWithLabel = [
    { label: 'Name', value: name },
    { label: 'SYMBOL', symbol: role },
    { label: 'Feature Identifier', value: identifier },
    { label: 'Orientation', value: orientation },
    { label: 'Role', value: role },
  ]
  const color = colorScale(name)
  const lighterColor = lighter(color)

  return (
    <div
      style={{
        width: 190,
        height: 320,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: color,
        margin: '0 2px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '6em',
          color: computeTextColor(color),
          backgroundColor: color,
          width: '100%',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          fontSize: 14,
          padding: 4,
        }}
      >
        {name}
      </div>
      <div
        style={{
          backgroundColor: lighterColor,
          height: '100%',
          width: '100%',
          padding: 4,
        }}
      >
        {infoWithLabel.map(({ label, value, symbol }) =>
          value ? (
            <div>
              <div style={{ fontSize: 14, fontWeight: 400, color: '#a3a3a3' }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
            </div>
          ) : symbol ? (
            `SYMBOL`
          ) : null
        )}
      </div>
    </div>
  )
}
