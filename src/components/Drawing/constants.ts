import { Step } from 'react-joyride'

export const getSteps = (t: (key: string) => string): Step[] => [
  {
    target: '.canvas-element',
    content: t('drawing.tour.canvas'),
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.width-range',
    content: t('drawing.tour.width'),
    placement: 'left',
  },
  {
    target: '.icon-undo',
    content: t('drawing.tour.undo'),
    placement: 'left',
  },
  {
    target: '.icon-redo',
    content: t('drawing.tour.redo'),
    placement: 'left',
  },
  {
    target: '.icon-eraser',
    content: t('drawing.tour.eraser'),
    placement: 'left',
  },
  {
    target: '.icon-pen',
    content: t('drawing.tour.pen'),
    placement: 'left',
  },
  {
    target: '.icon-download',
    content: t('drawing.tour.download'),
    placement: 'left',
  },
  {
    target: '.icon-trash',
    content: t('drawing.tour.clear'),
    placement: 'left',
  },
]
