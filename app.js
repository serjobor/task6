export default function (express, bodyParser, createReadStream, crypto, http) {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use((req, res, next) => {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE',
      'Access-Control-Allow-Headers': '*'
    })

    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
      return
    }

    if (!req.path.endsWith('/')) {
      res.redirect(301, req.path + '/')
      return
    }

    next()
  })

  const SYSTEM_LOGIN = "b8d44289-d86a-471b-9f1d-aceec5c9e948";

  app.get('/login/', (req, res) => {
    res.type('text/plain').send(SYSTEM_LOGIN)
  })

  app.get('/code/', (req, res) => {
    createReadStream(import.meta.url.substring(7)).pipe(res.type('text/plain'))
  })

  app.get('/sha1/:input/', (req, res) => {
    res.type('text/plain').send(
      crypto.createHash('sha1').update(req.params.input).digest('hex')
    )
  })

  const fetch = addr =>
    new Promise((resolve, reject) => {
      http.get(addr, r => {
        let data = ''
        r.on('data', c => data += c)
        r.on('end', () => resolve(data))
      }).on('error', reject)
    })

  app.get('/req/', async (req, res) => {
    res.type('text/plain').send(await fetch(req.query.addr))
  })

  app.post('/req/', async (req, res) => {
    res.type('text/plain').send(await fetch(req.body.addr))
  })

  app.all('*', (req, res) => {
    res.type('text/plain').send(SYSTEM_LOGIN)
  })

  return app
}
