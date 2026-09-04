const crypto = require('crypto')

const secret = () => process.env.ADMIN_TOKEN_SECRET || process.env.JWT_SECRET || 'change-this-development-secret'
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')
const sign = value => crypto.createHmac('sha256', secret()).update(value).digest('base64url')

const createToken = email => {
  const payload = encode({ email, role: 'admin', exp: Date.now() + 8 * 60 * 60 * 1000 })
  return `${payload}.${sign(payload)}`
}

const safeEqual = (left = '', right = '') => {
  const a = Buffer.from(String(left)), b = Buffer.from(String(right))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) throw new Error('Missing token')
    const [payload, signature] = token.split('.')
    if (!payload || !signature || !safeEqual(signature, sign(payload))) throw new Error('Invalid token')
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString())
    if (session.role !== 'admin' || session.exp < Date.now()) throw new Error('Expired token')
    req.user = session
    next()
  } catch { res.status(401).json({ success: false, message: 'Authentication required' }) }
}

const login = (req, res) => {
  const configuredEmail = process.env.ADMIN_EMAIL
  const configuredPassword = process.env.ADMIN_PASSWORD
  if (!configuredEmail || !configuredPassword) return res.status(503).json({ success: false, message: 'Admin credentials are not configured' })
  if (!safeEqual(req.body.email?.toLowerCase(), configuredEmail.toLowerCase()) || !safeEqual(req.body.password, configuredPassword)) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }
  res.json({ success: true, token: createToken(configuredEmail), user: { email: configuredEmail, role: 'admin', name: process.env.ADMIN_NAME || 'Administrator' } })
}

module.exports = { authenticate, login }
