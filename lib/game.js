import * as client from './client'

function handleResponse(next) {
    return function (res) {
        let data = ''
        
        res.on('data', function(chunk) {
            data += chunk
        }).on('end', function() {
            next(data)
        }).on('err', function(err) {
            next(data, err)
        })
    }
}

function executeCommand(method, player, next) {
    setTimeout(function() {
        client.request(method, player.id, handleResponse(next))
    }, 1001)
}

export function register(player, next) {
    executeCommand('register', player, next)
}

export function moveUp(player, next) {
    executeCommand('moveUp', player, next)
}

export function moveDown(player, next) {
    executeCommand('moveDown', player, next)
}

export function moveLeft(player, next) {
    executeCommand('moveLeft', player, next)
}

export function moveRight(player, next) {
    executeCommand('moveRight', player, next)
}

export function look(player, next) {
    executeCommand('look', player, next)
}
