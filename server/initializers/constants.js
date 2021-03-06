'use strict'

const config = require('config')
const path = require('path')

// ---------------------------------------------------------------------------

// API version
const API_VERSION = 'v1'

// Number of results by default for the pagination
const PAGINATION_COUNT_DEFAULT = 15

// Sortable columns per schema
const SEARCHABLE_COLUMNS = {
  VIDEOS: [ 'name', 'magnetUri', 'podUrl', 'author', 'tags' ]
}

// Sortable columns per schema
const SORTABLE_COLUMNS = {
  USERS: [ 'username', '-username', 'createdDate', '-createdDate' ],
  VIDEOS: [ 'name', '-name', 'duration', '-duration', 'createdDate', '-createdDate' ]
}

const OAUTH_LIFETIME = {
  ACCESS_TOKEN: 3600 * 4, // 4 hours
  REFRESH_TOKEN: 1209600 // 2 weeks
}

// ---------------------------------------------------------------------------

const CONFIG = {
  DATABASE: {
    DBNAME: 'peertube' + config.get('database.suffix'),
    HOST: config.get('database.host'),
    PORT: config.get('database.port')
  },
  STORAGE: {
    CERT_DIR: path.join(__dirname, '..', '..', config.get('storage.certs')),
    LOG_DIR: path.join(__dirname, '..', '..', config.get('storage.logs')),
    VIDEOS_DIR: path.join(__dirname, '..', '..', config.get('storage.videos')),
    THUMBNAILS_DIR: path.join(__dirname, '..', '..', config.get('storage.thumbnails')),
    TORRENTS_DIR: path.join(__dirname, '..', '..', config.get('storage.torrents'))
  },
  WEBSERVER: {
    SCHEME: config.get('webserver.https') === true ? 'https' : 'http',
    WS: config.get('webserver.https') === true ? 'wss' : 'ws',
    HOST: config.get('webserver.host'),
    PORT: config.get('webserver.port')
  }
}
CONFIG.WEBSERVER.URL = CONFIG.WEBSERVER.SCHEME + '://' + CONFIG.WEBSERVER.HOST + ':' + CONFIG.WEBSERVER.PORT

// ---------------------------------------------------------------------------

const CONSTRAINTS_FIELDS = {
  USERS: {
    USERNAME: { min: 3, max: 20 }, // Length
    PASSWORD: { min: 6, max: 255 } // Length
  },
  VIDEOS: {
    NAME: { min: 3, max: 50 }, // Length
    DESCRIPTION: { min: 3, max: 250 }, // Length
    MAGNET_URI: { min: 10 }, // Length
    DURATION: { min: 1, max: 7200 }, // Number
    TAGS: { min: 1, max: 3 }, // Number of total tags
    TAG: { min: 2, max: 10 }, // Length
    THUMBNAIL: { min: 2, max: 30 },
    THUMBNAIL64: { min: 0, max: 20000 } // Bytes
  }
}

// ---------------------------------------------------------------------------

// Score a pod has when we create it as a friend
const FRIEND_SCORE = {
  BASE: 100,
  MAX: 1000
}

// ---------------------------------------------------------------------------

const MONGO_MIGRATION_SCRIPTS = [
  {
    script: '0005-create-application',
    version: 5
  },
  {
    script: '0010-users-password',
    version: 10
  },
  {
    script: '0015-admin-role',
    version: 15
  }
]
const LAST_MONGO_SCHEMA_VERSION = 15

// ---------------------------------------------------------------------------

// Number of points we add/remove from a friend after a successful/bad request
const PODS_SCORE = {
  MALUS: -10,
  BONUS: 10
}

// Time to wait between requests to the friends (10 min)
let REQUESTS_INTERVAL = 600000

// Number of requests in parallel we can make
const REQUESTS_IN_PARALLEL = 10

// How many requests we put in request
const REQUESTS_LIMIT = 10

// Number of requests to retry for replay requests module
const RETRY_REQUESTS = 5

// ---------------------------------------------------------------------------

// Password encryption
const BCRYPT_SALT_SIZE = 10

// Express static paths (router)
const STATIC_PATHS = {
  THUMBNAILS: '/static/thumbnails',
  TORRENTS: '/static/torrents/',
  WEBSEED: '/static/webseed/'
}

// Cache control
let STATIC_MAX_AGE = '30d'

// Videos thumbnail size
const THUMBNAILS_SIZE = '200x110'

const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
}

// ---------------------------------------------------------------------------

// Special constants for a test instance
if (isTestInstance() === true) {
  CONSTRAINTS_FIELDS.VIDEOS.DURATION.max = 14
  FRIEND_SCORE.BASE = 20
  REQUESTS_INTERVAL = 10000
  STATIC_MAX_AGE = 0
}

// ---------------------------------------------------------------------------

module.exports = {
  API_VERSION,
  BCRYPT_SALT_SIZE,
  CONFIG,
  CONSTRAINTS_FIELDS,
  FRIEND_SCORE,
  LAST_MONGO_SCHEMA_VERSION,
  MONGO_MIGRATION_SCRIPTS,
  OAUTH_LIFETIME,
  PAGINATION_COUNT_DEFAULT,
  PODS_SCORE,
  REQUESTS_IN_PARALLEL,
  REQUESTS_INTERVAL,
  REQUESTS_LIMIT,
  RETRY_REQUESTS,
  SEARCHABLE_COLUMNS,
  SORTABLE_COLUMNS,
  STATIC_MAX_AGE,
  STATIC_PATHS,
  THUMBNAILS_SIZE,
  USER_ROLES
}

// ---------------------------------------------------------------------------

function isTestInstance () {
  return (process.env.NODE_ENV === 'test')
}
