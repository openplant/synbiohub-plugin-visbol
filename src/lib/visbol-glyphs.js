module.exports = {
  setSvgGlyphs: (properties) => {
    properties.display.toPlace.map((item, i) => {
      item.defaultString =
        '<svg width="100" height="100"><rect stroke="yellow" width="100" height="100" x="0" y="0" fill="red" /></svg>'
      return item
    })

    return computedProperities
  },

  getVisbolSequence: (displayList) => {
    const visbolSequence = displayList.components.flatMap((d) =>
      d.segments.flatMap((f) =>
        f.sequence.flatMap(({ tooltip }) => {
          const arr = tooltip.split('\n')

          const { Name, Identifier, Orientation, Role, Segment } = arr.reduce((acc, curr) => {
            if (curr.includes(':')) {
              const [key, value] = curr.split(':')
              return { ...acc, [key]: value.trim() }
            } else if (curr.includes('..')) {
              return { ...acc, Segment: curr.split('..').map(Number) }
            }
            return acc
          }, {})

          return {
            name: Name,
            identifier: Identifier,
            orientation: Orientation,
            role: Role,
            segment: Segment,
          }
        })
      )
    )

    return visbolSequence
  },
}
