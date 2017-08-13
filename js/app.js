(function() {
    function Player(name, el) {
        this.name = name
        this.active = false
        this.$el = el
        this.$caret = this.$el.querySelector('.caret')
    }

    Player.prototype = {
        render: function() {
            this.$el.className = name
        },
        reset: function(name) {
            this.name = name
            this.render()
        },
        setActive: function(active) {

        }


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
        this.$el = el;
    }

    Game.prototype = {
        start: function() {

        }
    }



    document.addEventListener('DOMContentLoaded', function() {
        window.game = new Game(document.querySelector('.container'))
    })


})()