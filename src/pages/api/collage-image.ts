import type { NextApiRequest, NextApiResponse } from 'next'

const STORAGE_HOST = 'firebasestorage.googleapis.com'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const source = typeof req.query.src === 'string' ? req.query.src : ''
  let imageUrl: URL

  try {
    imageUrl = new URL(source)
  } catch {
    res.status(400).end('Invalid image URL')
    return
  }

  if (
    imageUrl.hostname !== STORAGE_HOST ||
    !imageUrl.pathname.startsWith('/v0/b/nomad-sketching-website.appspot.com/o/')
  ) {
    res.status(400).end('Unsupported image source')
    return
  }

  try {
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      res.status(imageResponse.status).end('Image unavailable')
      return
    }

    const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream'
    if (!contentType.startsWith('image/')) {
      res.status(415).end('Unsupported image type')
      return
    }

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(200).send(Buffer.from(await imageResponse.arrayBuffer()))
  } catch {
    res.status(502).end('Unable to load image')
  }
}
