import React from 'react'
import * as d3 from 'd3'
import './VisbolRenderer.css'
import SymbolSVG from './SymbolSVG.jsx'

function lighter(color) {
  const lighterColor = d3.color(color)
  lighterColor.opacity = 0.15
  return lighterColor.rgb()
}

function computeTextColor(bgColor) {
  const darkText = '#151515'
  const lightText = '#FFFFFF'
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
  const { name, identifier, orientation, role, segment } = info
  const color = colorScale(name)
  const lighterColor = lighter(color)

  return (
    <div
      className="card roboto-sans"
      style={{ borderColor: color }}
    >
      <div
        className="card-title-wrapper"
        style={{ backgroundColor: color, color: computeTextColor(color) }}
      >
        <div className="card-title" style={{ backgroundColor: color }}>
          {name}
        </div>
      </div>
      <div
        style={{
          backgroundColor: lighterColor,
          padding: 4,
        }}
      >
        <div className="card-subtitle-wrapper">
          <div className="card-subtitle">{role}</div>
        </div>

        <div style={{ width: '100%', height: 160 }}>
          <SymbolSVG role={role} orientation={orientation ?? 'inline'} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '0 0 auto',
            padding: '8px 6px',
            gap: 6,
            fontSize: 14,
          }}
        >
          <div style={{ flex: '0 0 auto' }}>
            <div style={{ color: '#a3a3a3' }}>Feature Identifier</div>
            <div>{identifier ?? '?'}</div>
          </div>

          <div style={{ flex: '0 0 auto' }}>
            <div style={{ color: '#a3a3a3' }}>Orientation</div>
            <div>{orientation ?? '?'}</div>
          </div>

          <div style={{ display: 'flex', flex: '1 0 auto' }} />

          <div style={{ flex: '0 0 auto' }}>
            <div style={{ color: '#a3a3a3' }}>Segment</div>
            <div style={{ display: 'flex', flex: '0 0 auto' }}>
              <div>{segment?.[0] ?? '?'}</div>
              <div
                style={{
                  flex: '1 1 100%',
                  borderBottom: '2px solid black',
                  height: '12px',
                  margin: '0 5px',
                }}
              />
              <div>{segment?.[1] ?? '?'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
