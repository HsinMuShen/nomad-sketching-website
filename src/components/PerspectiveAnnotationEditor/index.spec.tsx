import { useState } from 'react'
import type { ComponentProps } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PerspectiveAnnotationEditor from '.'
import { EMPTY_PERSPECTIVE_ANNOTATION, type PerspectiveAnnotation } from '../../types/spatialMemory'

jest.mock('next/image', () => {
  function MockImage({ fill, ...props }: ComponentProps<'img'> & { fill?: boolean }) {
    void fill
    return <img {...props} />
  }

  return MockImage
})

const t = (key: string) => key

const Harness = () => {
  const [value, setValue] = useState<PerspectiveAnnotation>(EMPTY_PERSPECTIVE_ANNOTATION)
  return (
    <PerspectiveAnnotationEditor imageSrc="/drawing.jpg" imageAlt="Drawing" value={value} onChange={setValue} t={t} />
  )
}

describe('PerspectiveAnnotationEditor', () => {
  it('records a horizon, vanishing point, and four facade corners from the source image', () => {
    const { container } = render(<Harness />)
    const canvas = container.querySelector('svg') as SVGSVGElement
    Object.defineProperty(canvas, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        right: 100,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    })

    fireEvent.click(screen.getByText('spatialMemory.toolHorizon'))
    fireEvent.click(canvas, { clientX: 30, clientY: 40 })

    fireEvent.click(screen.getByText('spatialMemory.toolVanishingA'))
    fireEvent.click(canvas, { clientX: 80, clientY: 40 })

    fireEvent.click(screen.getByText('spatialMemory.toolFacade'))
    ;[
      [20, 25],
      [70, 30],
      [72, 80],
      [18, 75],
    ].forEach(([clientX, clientY]) => fireEvent.click(canvas, { clientX, clientY }))

    expect(screen.getByText(/4\/4 spatialMemory.facadePoints/)).toBeInTheDocument()
    expect(screen.getByText(/1\/2 spatialMemory.vanishingPoints/)).toBeInTheDocument()
    expect(screen.getByText(/spatialMemory.horizonSet/)).toBeInTheDocument()
  })
})
