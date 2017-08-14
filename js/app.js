(function() {
    function Player(name, el) {
        this.name = name
        this.active = false
        this.$el = el
        this.$caret = this.$el.querySelector('.caret')
    }

    Player.prototype = {
        render: function() {
            var players = ['vue', 'react', 'angular']
            var classes = this.$el.classList
            players.forEach(function(item, index) {
                if(classes.contains(item)) {
                    classes.remove(item)
                }
            })
            classes.add(this.name)
        },
        reset: function(name) {
            this.name = name
            this.render()
        },
        setActive: function(active) {

        }
    }

    Player.random = function(name) {
            var players = ['vue', 'react', 'angular']
            if(name) {
                 players = players.filter(function(frame){
                    return frame !== name
                })
            }
            return players[Math.floor(Math.random() * players.length)]
        }



    function Square(el){
        this.$el = el;
        this.val = 0;
    }

    Square.prototype = {
        set: function(name, val) {

        },
        reset: function() {

        }
    }



    function Game(el) {
        this.$el = el
        this.state = 'init'

        this.p1 = new Player(Player.random(), document.querySelector('#l-wrapper'))
        this.p2 = new Player(Player.random(this.p1.name), document.querySelector('#r-wrapper'))
        
        this.p1.render()
        this.p2.render()

        this.$diceP1 = this.$el.querySelector('#dice-p1')
        this.$diceP2 = this.$el.querySelector('#dice-p2')

        var onClickDice = this.onClickDice.bind(this)
        this.$diceP1.addEventListener('click', onClickDice)
        this.$diceP2.addEventListener('click', onClickDice)

        this.$start = this.$el.querySelector('.btn.start')
        this.$overlay = this.$el.querySelector('.overlay')
        this.$reset = this.$el.querySelector('.btn.reset')
        this.$playground = this.$el.querySelector('.playground')
        this.$winner = this.$el.querySelector('.winner')


        this.$start.addEventListener('click', this.onClickStart.bind(this))
        this.$reset.disabled = true
    }

    Game.prototype = {
        start: function() {
           
            this.$overlay.hidden = true
            this.$start.hidden = true
            this.$reset.disabled = false
            this.state = 'start'
        },
        reset: function() {

            this.state = 'init'
        },
        onClickDice: function(e) {
            if(e.target.matches('#dice-p1')) {
                this.p1.reset(Player.random(this.p1.name))
            }else if(e.target.matches('#dice-p2')) {
                this.p2.reset(Player.random(this.p2.name))
            }
            //相同就禁用
            this.$start.disabled = (this.p1.name === this.p2.name) 
        },
        onClickStart: function(e) {
            if(this.p1.name !== this.p2.name) {
                this.start()
            }
        }
       
    }



    document.addEventListener('DOMContentLoaded', function() {
        window.game = new Game(document.querySelector('.container'))
    })


})()