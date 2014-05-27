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
function endstep(game_id){
    socket.emit('endstep', game_id);
}
function takeAll(game_id){
    socket.emit('take', game_id);
}

function Drawing(deck, len){
    var player_cards=document.getElementById('player_cards');
    var enemy_cards=document.getElementById('enemy_card');
    var n;
    removeChildren(enemy_cards, null);
    removeChildren(player_cards, null);
    for (i = 0; i < len; i++){
        //enemy card
        var enemy_card = document.createElement('div');
        enemy_card.className='enemy_cards';
        enemy_card.id = i + 'enemy';
        enemy_cards.appendChild(enemy_card);
        setBackground(-1,enemy_card);
    }
    for (i = 0; i < deck.length; i++){
        //player card
        n = deck[i];
        var card = document.createElement('div');
        card.className='cards';
        card.id=deck[i];
        card.onclick=function(){
            socket.emit('step',Foolgame.game_id,(this).id);
        }
        player_cards.appendChild(card);
        setBackground(n,card);
    }
}

function removeChildren(node, pdeck) {
    var children = node.childNodes;
    while(children.length) {
        node.removeChild(children[0]);
    }
    if (pdeck)
        for(var i=0;i<pdeck.length;i++){
            //player card
            var n = pdeck[i];
            var card = document.createElement('div');
            card.className='cards';
            card.id=pdeck[i];
            card.onclick=function(){
                socket.emit('step',Foolgame.game_id,(this).id);
            }
            node.appendChild(card);
            setBackground(n,card);
        }
}



//

//<button id="button" class="btn btn-default btn-xs" style="margin: 30px 0 5px 15px;" onclick="endstep(Foolgame.game_id);">Беру</button>
var Foolgame={
    game_id: null,
    turn: false,
    deck: [],
    init: function(){
        $(function(){
            socket.emit('start');
            socket
                .on('wait', function(){
                })
                .on('ready', function(game_id, turn){
                    Foolgame.game_id = game_id;
                    Foolgame.turn =turn;
                    if(turn){
                        var btn = document.getElementById('button');
                        btn.innerHTML = "Завершить ход";
                        btn.onclick = function(){
                            endstep(Foolgame.game_id);
                        };
                    }else{
                        var btn = document.getElementById('button');
                        btn.innerHTML = "Беру";
                        btn.style.margin = "30px 0 5px 47px";
                        btn.onclick = function(){
                            takeAll(Foolgame.game_id);
                        }
                    }
                })
                .on('end', function(){
                  socket.emit('close', this.game_id);
                })
                .on('distribution', function(deck, len){
                    Drawing(deck, len);
                })
                .on('take',function(pdeck){
                    var player_cards = document.getElementById("player_cards");
                    var cards_ontable = document.getElementById('enemy_field');
                    var gamefield=document.getElementById('player_field');
                    removeChildren(player_cards,pdeck);
                    removeChildren(gamefield,null);
                    removeChildren(cards_ontable,null);


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


