import * as game from './game'
import * as ai from './ai'
import { commands, gameUrl } from './config'

export class Player {
    constructor() {
        this.player = {
            id: 0,
            name: '',
            isIt: false,
            players: []
        }
    }

    move() {
        switch (ai.getNextMove(this.player)) {
            case commands.up:
                game.moveUp(this.player, this.updatePlayerState)
                break
            case commands.down:
                game.moveDown(this.player, this.updatePlayerState)
                break
            case commands.left:
                game.moveLeft(this.player, this.updatePlayerState)
                break
            case commands.right:
                game.moveRight(this.player, this.updatePlayerState)
                break
            case commands.look:
                game.look(this.player, this.updatePlayerState)
                break
        }
    }

    updatePlayerState(data, err) {
        if (err)
            console.log(err)

        if (data) {
            const player = JSON.parse(data)
            if (player.isIt && !_player.isIt) {
                console.log('You have been tagged -- you are it')
                console.log('')
            } else if (this.player.isIt && !player.isIt) {
                console.log('You tagged another player -- you are no longer it')
                console.log('')
            }

            this.player = player

            this.move()
        }
        else {
            console.log('No response. Player not moved')
        }
    }

    handleRegister(data, err) {
        this.updatePlayerState(data, err)
        
        if(this.player.id) {
            console.log('')
            console.log('You successfully registered at', gameUrl)
            console.log('')
            console.log('Your player name is', this.player.name, 'id:', this.player.id)
            console.log('You are', this.player.isIt ? 'it' : 'not it')
            console.log('')
        }
    }

    play() {
        game.register(this.player, this.handleRegister)
    }
}
