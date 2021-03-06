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
function removeChildren(node) {
    var children = node.childNodes;
    while(children.length) {
        node.removeChild(children[0]);
    }
}
function Disablebtn(){
    var btn = document.getElementById('button');
    btn.disabled = true;
}
var Foolgame={
    game_id: null,
    turn: false,
    init: function(){
        $(function(){
            Disablebtn();
            var dis = document.getElementById('display');
            dis.innerHTML = "Ожидание соперника";
            socket.emit('start');
            socket
                .on('wait', function(){
                })
                .on('ready', function(game_id){
                    Foolgame.game_id = game_id;
                })
                .on('turn', function(game_id,turn){
                    Foolgame.SwitchButton(turn,game_id);
                })
                .on('end', function(){
                  socket.emit('close', Foolgame.game_id);
                })
                .on('distribution', function(deck, len, index){
                    Foolgame.Drawing(deck, len);
                    var qw = document.getElementById('deck');
                    var ind = document.getElementById('index');
                    if (index>50)
                        qw.className = "";
                    if (index>51){
                        var adv = document.getElementById('advantage');
                        adv.className = "";
                    }
                    qw.onmouseover = function(){
                        ind.style.display = "block";
                        ind.innerHTML = 52-index;
                    }
                    qw.onmouseout = function(){
                        ind.style.display = "none";
                    }
                })
                .on('enemy_take', function(){
                    Foolgame.showThinking();
                })
                .on('advantage', function(id){
                    Foolgame.Advantage(id);
                })
                .on('step_user',function(id){
                    Foolgame.Userstep(id);
                })
                .on('step_enemy',function(id,ncard){
                    Foolgame.Enemystep(id,ncard)
                })
                .on('draw', function(){
                    clearTable();
                    Foolgame.DisplayChange("Ничья");
                })
                .on('lose', function(){
                    clearTable();
                    Foolgame.DisplayChange("Вы днище");
                })
                .on('win', function(){
                    clearTable();
                    Foolgame.DisplayChange("Поздравляем, вы уделали этого сосунка ;)");
                }).on('take_ok', function(){
                    Disablebtn();
                })
        })
    },
    Userstep: function(id){
        $(function(){
        var delcard = document.getElementById(id);
        delcard.remove();
        var gamefield=document.getElementById('player_field');
        var card = document.createElement('div');
        card.className='cards';
        gamefield.appendChild(card);
        setBackground(id,card);
        })
    },
    showThinking: function(){
        $(function(){
        var div = document.getElementById('thinking');
        div.style.display = 'block';
        })
    },
    Enemystep: function(id,ncard){
        $(function(){
            var delcard = document.getElementById(ncard+'enemy');
            delcard.remove();
            var gamefield=document.getElementById('enemy_field');
            var card = document.createElement('div');
            card.className='cards';
            gamefield.appendChild(card);
            setBackground(id,card);
        })
    },
    Advantage: function(id){
        $(function(){
            var ad = document.getElementById('advantage');
            ad.className='adcard';
            setBackground(id,ad);
            var deck = document.getElementById('deck');
            deck.className = 'decktop';
        })
    },
    Drawing: function(deck, len){
        $(function(){
            clearTable();
            var margin;
            var player_cards=document.getElementById('player_cards');
            var enemy_cards=document.getElementById('enemy_card');
            var n;
            for (i = 0; i < len; i++){
                //enemy card
                var enemy_card = document.createElement('div');
                enemy_card.className='enemy_cards';
                enemy_card.id = i + 'enemy';
                if (len>7){
                    margin = -(len-7)*3;
                    enemy_card.style.marginLeft = margin+'px';
                }
                enemy_cards.appendChild(enemy_card);
                setBackground(-1,enemy_card);
            }
            for (i = 0; i < deck.length; i++){
                //player card
                n = deck[i];
                var card = document.createElement('div');
                card.className='cards';
                card.id=deck[i];
                if (deck.length>7){
                    margin = -(deck.length-7)*3;
                    card.style.marginLeft = margin+'px';
                }
                card.onclick=function(){
                    socket.emit('step',Foolgame.game_id,(this).id);
                }
                player_cards.appendChild(card);
                setBackground(n,card);
            }
        })
  },
    SwitchButton: function(turn,game_id){
        $(function(){
        var btn = document.getElementById('button');
        var dis = document.getElementById('display');
        if(turn){
            dis.innerHTML = "Ваш ход";
            btn.disabled = false;
            btn.innerHTML = "Завершить ход";
            btn.style.margin = "30px 0 5px 12px";
            btn.onclick = function(){
                socket.emit('endstep', game_id);
                var div = document.getElementById('thinking');
                div.style.display = 'none';
            };
        }else{
            dis.innerHTML = "Вы отбиваетесь";
            btn.innerHTML = "Беру";
            btn.disabled = false;
            btn.style.margin = "30px 0 5px 42px";
            btn.onclick = function(){
                socket.emit('take', game_id);
            }
        }
    })
    },
    DisplayChange: function(str){
        $(function(){
            var btn = document.getElementById('button');
            var dis = document.getElementById('display');
                dis.innerHTML = str;
                btn.innerHTML = "Найти игру";
                btn.style.margin = "30px 0 5px 12px";
                btn.onclick = function(){
                    Foolgame.init();
                };
        })
    }
}



