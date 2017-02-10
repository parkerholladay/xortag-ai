import http from 'http'
import { gameUrl } from './config'

function getOptions(host, method, id) {
    return {
        hostName: host,
        path: '/' + method + '/' + id,
        method: 'GET'
    }
}

export function request(method, id, callback) {
    http.request(getOptions(gameUrl, method, id), callback).on('error', function (err) {
        console.log('Client error:', err)
        callback()
    }).end()
}
