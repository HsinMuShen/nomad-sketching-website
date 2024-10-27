import { Step } from 'react-joyride'

export const Steps: Step[] = [
  {
    target: '.canvas-element',
    content: 'Welcome to the drawing page. This is the main drawing canvas.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.width-range',
    content: 'Adjust the width of the drawing pen or eraser.',
    placement: 'left',
  },
  {
    target: '.icon-undo',
    content: 'Click here to undo the last action.',
    placement: 'left',
  },
  {
    target: '.icon-redo',
    content: 'Click here to redo the last undone action.',
    placement: 'left',
  },
  {
    target: '.icon-eraser',
    content: 'Switch to the eraser tool.',
    placement: 'left',
  },
  {
    target: '.icon-pen',
    content: 'Switch to the drawing pen tool.',
    placement: 'left',
  },
  {
    target: '.icon-download',
    content: 'Download your drawing as an image file.',
    placement: 'left',
  },
  {
    target: '.icon-trash',
    content: 'Clear the drawing canvas.',
    placement: 'left',
  },
]
