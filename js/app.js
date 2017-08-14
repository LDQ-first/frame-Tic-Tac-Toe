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
            this.active = active
            this.$caret.hidden = !active
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
            this.$el.classList.add(name)
            this.val = val
        },
        reset: function() {
            this.$el.className = 'square'
            this.val = 0
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
        this.$audio = this.$el.querySelector('audio')
        this.$dogfall = this.$el.querySelector('.dogfall')
        this.$Llogo = this.$el.querySelector('.L-logo')
        this.$Rlogo = this.$el.querySelector('.R-logo')

        this.$start.addEventListener('click', this.onClickStart.bind(this))
        
        this.$reset.disabled = true
        this.$reset.addEventListener('click', this.onClickReset.bind(this))

        this.$playground.addEventListener('click', this.onClickSquare.bind(this))

        var $squares = [].slice.call(this.$el.querySelectorAll('.square'))      
        this.squares = $squares.map(function (ele) {
            return new Square(ele)
        })



    }
    /*
     [0, 0, 0]
     [0, 0, 0]
     [0, 0, 0]
    */
    Game.prototype = {
        start: function() {
            this.setDiceHidden(true)
            this.p1.setActive(true)
            this.p2.setActive(false)
            this.$overlay.hidden = true
            this.$start.hidden = true
            this.$reset.disabled = false
            this.controlAuido('start')
            this.state = 'start'
        },
        reset: function() {
            this.setDiceHidden(false)
            this.p1.setActive(false)
            this.p2.setActive(false)
            this.resetSquares()
            this.$winner.hidden = true
            this.$winner.className = 'winner'
            this.$dogfall.hidden = true
            this.$Llogo.classList.remove(this.p1.name)
            this.$Rlogo.classList.remove(this.p2.name)
            this.$overlay.hidden = false
            this.$start.hidden = false
            this.$reset.disabled = true
            this.controlAuido('reset')
            this.state = 'init'
        },
        setDiceHidden: function(hidden) {
            this.$diceP1.hidden = !!hidden
            this.$diceP2.hidden = !!hidden
        },
        onClickDice: function(e) {
            if(e.target.matches('#dice-p1')) {
                this.p1.reset(Player.random(this.p1.name))
            }else if(e.target.matches('#dice-p2')) {
                this.p2.reset(Player.random(this.p2.name))
            }
             this.controlAuido('dice')
            //相同就禁用
            this.$start.disabled = (this.p1.name === this.p2.name) 
        },
        onClickStart: function(e) {
            if(this.p1.name !== this.p2.name) {
                this.start()
            }
        },
        onClickReset: function(e) {
            this.reset()
        },
        onClickSquare: function(e) {
            if(!e.target.matches('.square') || 
               this.state !== 'start' || 
               this.isEnded() ||
               e.target.classList.length > 1) {
                    return
            }


            this.squares[e.target.dataset.index].set(
                this.activePlayer().name, this.p1.active ? 1 : -1
            )

            if(this.isdogfalled()) {
                 console.log('平局')
                 this.showDogfalled(this.p1, this.p2)
                 this.controlAuido('dogfall')
                 return
            } 

            var winner = this.getWinner()
            if(winner) {
                this.showWinner(winner)
                this.controlAuido('win')
                return
            } else {
                this.controlAuido('click')
            }
            
            this.switchPlayer()

        },
        activePlayer: function() {
            return this.p1.active ? this.p1 : this.p2
        },
        switchPlayer: function() {
           this.p1.setActive(!this.p1.active)
           this.p2.setActive(!this.p2.active)
        },
        calcWinValues: function() {
            var wins = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ]
            var result = []
            for(var i = 0; i < wins.length; i++) {
                var val = this.squares[wins[i][0]].val
                        + this.squares[wins[i][1]].val
                        + this.squares[wins[i][2]].val
                result.push(val)
            }
            return result
        },
        getWinner: function() {
            var values = this.calcWinValues()
            if(values.find(function(v) { return v === 3 })) {
                return this.p1
            }
            else if(values.find(function(v) { return v === -3 })) {
                return this.p2
            }
        },
        showWinner: function(winner) {
            this.$overlay.classList.add('minimize')
            this.$overlay.hidden = false
            this.$winner.hidden = false
            this.$winner.classList.add(winner.name)
            var _this = this
            setTimeout(function() {
                _this.$overlay.classList.remove('minimize')
            }, 500)
        },
        isAllSquaresUsed: function() {
            return !this.squares.find(function(s) {
                return s.val === 0
            })
        },
        isdogfalled: function() {
           return this.isEnded() && !this.getWinner()
        },
        showDogfalled: function(p1, p2) {
            this.$overlay.classList.add('minimize')
            this.$overlay.hidden = false
            this.$dogfall.hidden = false
            this.$Llogo.classList.add(p1.name)
            this.$Rlogo.classList.add(p2.name)
            setTimeout(function() {
                this.$overlay.classList.remove('minimize')
            }.bind(this), 500)
        },
        isEnded: function() {
            return !!this.getWinner() || this.isAllSquaresUsed() 
        },
        resetSquares: function() {
            this.squares.forEach(function(square) {
                square.reset()
            })
        },
        controlAuido: function(which) {
           /* this.$audio.src = window.location.origin + 
                            '/music/' + which + '.wav'*/
            this.$audio.src = 
                 'http://ldqblog.me/frame-Tic-Tac-Toe/music/' 
                 + which + '.wav'
            this.$audio.play();
        }
       
    }



    document.addEventListener('DOMContentLoaded', function() {
        window.game = new Game(document.querySelector('.container'))
    })



})()