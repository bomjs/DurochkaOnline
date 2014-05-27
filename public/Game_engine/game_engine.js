function setBackground(id_card,el){
    var i, j,dy,dyy,dx,dxx, h,w;
    h=74;
    w=52.61;
    dy=14;
    dyy=3;
    dx=23;
    dxx=4;
    if(id_card<0){
        el.style.backgroundPosition = ((-1)*(dy+w*13+dyy*(13-1)))+"px "+(-1*(dx+h*2+dxx*(2-1)))+"px";
    }else{
        j = Math.floor(id_card/13);
        i = id_card-13*j;
        el.style.backgroundPosition = ((-1)*(dy+w*i+dyy*(i-1)))+"px "+(-1*(dx+h*j+dxx*(j-1)))+"px";
    }
}
function Drawing(deck){
    var player_cards=document.getElementById('player_cards');
    var enemy_cards=document.getElementById('enemy_card');
    var n;
    for (k = 0; k < 6; k++){
        //enemy card
        var enemy_card = document.createElement('div');
        enemy_card.className='enemy_cards';
        enemy_card.id = k + 'enemy';
        enemy_cards.appendChild(enemy_card);
        setBackground(-1,enemy_card);
        //player card
        n = deck[k];
        var card = document.createElement('div');
        card.className='cards';
        card.id=deck[k];
        card.onclick=function(){
            socket.emit('step',Foolgame.game_id,(this).id);
        }
        player_cards.appendChild(card);
        setBackground(n,card);
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
                .on('advantage', function(id){
                    var ad = document.getElementById('advantage');
                    ad.className='adcard';
                    setBackground(id,ad);
                    var deck = document.getElementById('deck');
                    deck.className = 'decktop';
                })
                .on('step_user',function(id){
                    var delcard = document.getElementById(id);
                    delcard.remove();
                    var gamefield=document.getElementById('player_field');
                    var card = document.createElement('div');
                    card.className='cards';
                    gamefield.appendChild(card);
                    setBackground(id,card);
                })
                .on('step_enemy',function(id,ncard){
                    var delcard = document.getElementById(ncard+'enemy');
                    delcard.remove();
                    var gamefield=document.getElementById('enemy_field');
                    var card = document.createElement('div');
                    card.className='cards';
                    gamefield.appendChild(card);
                    setBackground(id,card);
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


