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
function clearTable(){
    var player_cards=document.getElementById('player_cards');
    var enemy_cards=document.getElementById('enemy_card');
    var field_enemy = document.getElementById('enemy_field');
    var field_user = document.getElementById('player_field');
    removeChildren(enemy_cards);
    removeChildren(player_cards);
    removeChildren(field_enemy);
    removeChildren(field_user);
}

function Drawing(deck, len){
    clearTable();
    var player_cards=document.getElementById('player_cards');
    var enemy_cards=document.getElementById('enemy_card');
    var n;
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

function removeChildren(node) {
    var children = node.childNodes;
    while(children.length) {
        node.removeChild(children[0]);
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
    }
}

window.onload = function(){
    Foolgame.init();
}


