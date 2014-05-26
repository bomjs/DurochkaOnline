function Drawing(deck){
    var player_cards=document.getElementById('player_cards');
    var enemy_cards=document.getElementById('enemy_card');
    var i, j, n,dy,dyy,dx,dxx, h,w;
    h=74;
    w=52.61;
    dy=14;
    dyy=3;
    dx=23;
    dxx=4;
    for (k = 0; k < 6; k++){
        //enemy card
        var enemy_card = document.createElement('div');
        enemy_card.className='enemy_cards';
        enemy_cards.appendChild(enemy_card);
        enemy_card.style.backgroundPosition = ((-1)*(dy+w*13+dyy*(13-1)))+"px "+(-1*(dx+h*2+dxx*(2-1)))+"px";
        //player card
        n = deck[k];
        j = Math.floor(n/13);
        i = n-13*j;
        var card = document.createElement('div');
        card.className='cards';
        card.id=deck[k];
        card.onclick=function(){
            socket.emit('step',Foolgame.game_id,(this).id);
        }
        player_cards.appendChild(card);
        card.style.backgroundPosition = ((-1)*(dy+w*i+dyy*(i-1)))+"px "+(-1*(dx+h*j+dxx*(j-1)))+"px";
    }
}
var Foolgame={
    game_id: null,
    turn: false,
    deck: [],
    init: function(){
        $(function(){
            alert('init');
            socket.emit('start');
            socket
                .on('wait', function(){
                    alert('wait');
                })
                .on('ready', function(game_id){
                    alert('ready '+game_id);
                    Foolgame.game_id = game_id;
                })
                .on('end', function(){
                  socket.emit('close', this.game_id);
                })
                .on('distribution', function(deck){
                    Drawing(deck);
                })
                .on('card',function(id){
                   alert(id);
                    //drawing card on pole
                })
        })
    },
    startGame: function(gameId, turn, x, y){
        this.game_id = gameId;
        this.turn = turn;

    }
}

window.onload = function(){
    Foolgame.init();
}


