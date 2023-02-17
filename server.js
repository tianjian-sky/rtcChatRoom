const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({
    port: 9001,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }
})

const wss2 = new WebSocketServer({
    port: 9002,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }
})

let conn, conn2

wss.on('connection', function connection(ws) {
    conn = ws
    conn.on('message', function message(data) {
        const msg = data.toString()
        const obj = JSON.parse(data.toString())
        console.log('server received from client', obj)
        switch (obj.type) {
            case 'wsOpen':
                conn.send(JSON.stringify({ type: 'wsConnected' }));
                break
            case 'offer':
                conn2.send(msg)
                break
            case 'candidate':
                conn2.send(msg)
                break
            default:
                break
        }
    })
})
wss2.on('connection', function connection(ws) {
    conn2 = ws
    conn2.on('message', function message(data) {
        const msg = data.toString()
        const obj = JSON.parse(data.toString())
        console.log('server received from client2', obj)
        switch (obj.type) {
            case 'wsOpen':
                conn2.send(JSON.stringify({ type: 'wsConnected' }));
                break
            case 'answer':
                conn.send(msg)
                break
            case 'candidate':
                conn.send(msg)
                break
            case 'reconnect':
                conn.send(msg)
                break
            case 'negotiationneeded':
                conn.send(msg)
                break
            default:
                break
        }
    })
})