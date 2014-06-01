var games = [];
function juciefroot(pdeck, x, deck, index){
    var i;
    if (pdeck.length>0){
        for(i = index; i<index+(5-x); i++){
            pdeck[5-(i-index)] = deck[i];
        }
    }else{
        for(i = index; i<index+(6-x); i++){
            pdeck[5-(i-index)] = deck[i];
        }

    }
    return pdeck;
}
union = function(mas){
    var res = [];
    var k=0;
    for(var i=0;i<2;i++){
        for(var j= 0;j<mas[i].length;j++){
            res[k]=parseInt(mas[i][j]);
            k++;
        }
    }
    return res;
}
numcard = function(id_card){
    var j = Math.floor(id_card/13);
    return id_card-13*j;

}
mastcard = function(id_card){
    return Math.floor(id_card/13);
}
trycover = function(game_id, id){
    if (games[game_id].board[0].length==games[game_id].board[1].length)
        return false;
    var card = games[game_id].board[0][games[game_id].board[1].length];
    if((mastcard(card)==mastcard(id))&&(numcard(card)<numcard(id))){
        return true;
    }
    if ((mastcard(games[game_id].advantage)==mastcard(id))&&((mastcard(card)!=mastcard(id)))){
        return true;
    }
    return false;
}
tryput = function(game_id,id){
    if(games[game_id].board[0].length){
        for(i=0; i<games[game_id].board[0].length;i++){
            if(numcard(id)==numcard(games[game_id].board[0][i])){
                return true;
            }
        }
        for(i=0; i<games[game_id].board[1].length;i++){
            if(numcard(id)==numcard(games[game_id].board[1][i])){
                return true;
            }
        }
        return false;
    }else{
        return true;
    }
}
indexOf = function(deck,id){
    for (i=0;i<deck.length;i++)
        if (deck[i]==id) return i;
    return -1;
}
var FoolGame = module.exports = function() {
    // Массив id игры = объект игры
    //this.games = [];
 }
var GameItem = function(game_id, user, enemy, x, y) {
    this.game_id = game_id;
    //Колода
    this.deck = [52];
    for(var i=0;i<52;i++){
        this.deck[i]=i;
    }
    this.shuffle();
    //Козырь
    this.advantage = this.deck[51];
    // Игроки
    this.board = [[],[]];
    this.user = user;
    this.enemy = enemy;
    // Количество карт у каждого игрока
    this.pl1 = x;
    this.pl2 = y;
    this.pdeck1 = [];
    this.pdeck2 = [];
    // Кол-во сделанных ходов
    this.steps_user = 0;
    this.steps_enemy = 0;
    this.index = 0;
    // флаг на взятие карт
    this.turn = 0;
}
GameItem.prototype.shuffle = function(){
    for(var j, x, i = this.deck.length; i; j = parseInt(Math.random() * i), x = this.deck[--i], this.deck[i] = this.deck[j], this.deck[j] = x);
};
GameItem.prototype.distribution=function(){
    this.board = [[],[]];
    if (this.index<52){
        var x = this.pdeck1.length,y=this.pdeck2.length;
        var len=0;
        if (6-x>0)
            len+=6-x;
        if (6-y>0)
            len+=6-y;
        console.log('index = '+this.index+len);
        if (this.index+len>52){
            console.log('last');
            if (x>y){
                for (i=y-1;i<x;i++){
                    this.pdeck2[i]=this.deck[this.index];
                    this.index++;
                }
            }
            if(y>x){
                    for (i=x-1;i<y;i++){
                        this.pdeck1[i]=this.deck[this.index];
                        this.index++;
                    }
                }
            x = this.pdeck1.length;
            y = this.pdeck2.length;
            var tmp = 52-this.index;
            tmp=tmp/2;
            for (i = x-1;(i<x+tmp-1)&&(this.index<52);i++){
                this.pdeck1[i]=this.deck[this.index];
                this.index++;
            }
            for (i = y-1;(i<y+tmp-1)&&(this.index<52);i++){
                this.pdeck2[i]=this.deck[this.index];
                this.index++;
            }
            this.pl1 = this.pdeck1.length-1;
            this.pl2 = this.pdeck2.length-1;
        }
        else{
            if(x<6){
                this.pdeck1=juciefroot(this.pdeck1,this.pl1,this.deck, this.index);
                this.index+=this.pdeck1.length-x;
                this.pl1 = 5;
            }
            if(y<6){
                this.pdeck2=juciefroot(this.pdeck2,this.pl2,this.deck, this.index);
                this.index+=this.pdeck2.length - y;
                this.pl2 = 5;
            }
    }    }
    this.user.emit('distribution', this.pdeck1, this.pdeck2.length);
    this.enemy.emit('distribution', this.pdeck2, this.pdeck1.length);
    this.user.emit('turn',this.game_id,true);
    this.enemy.emit('turn',this.game_id,false);
    console.log('index '+this.index);
    console.log(this.pdeck1);
    console.log(this.pdeck2);
    console.log(this.deck);
}
FoolGame.CreateGame = function(game_id, user, enemy, x, y){
    var game = new GameItem(game_id,user,enemy,x,y);
    games[game_id]=game;
    games[game_id].distribution();
    games[game_id].user.emit('advantage',games[game_id].advantage);
    games[game_id].enemy.emit('advantage',games[game_id].advantage);
}
FoolGame.Step = function(game_id,id,user){
    console.log('step');
        if((games[game_id].user.id == user.id)&&(tryput(game_id,id)))
        {
            games[game_id].enemy.emit('step_enemy',id,games[game_id].pl1);
            games[game_id].user.emit('step_user',id);
            games[game_id].pdeck1.splice(indexOf(games[game_id].pdeck1,id), 1);
            games[game_id].pl1--;
            games[game_id].board[0][games[game_id].steps_user]=id;
            games[game_id].steps_user++;
        }
        if((games[game_id].enemy.id == user.id)&&(trycover(game_id,id))&&(!games[game_id].turn))
        {
            games[game_id].user.emit('step_enemy',id,games[game_id].pl2);
            games[game_id].enemy.emit('step_user',id);
            games[game_id].pdeck2.splice(indexOf(games[game_id].pdeck2,id), 1);
            games[game_id].pl2--;
            games[game_id].board[1][games[game_id].steps_enemy]=id;
            games[game_id].steps_enemy++;
        }
}
FoolGame.drub = function(game_id){
    var tmp_user,tmp_deck,tmp;
    games[game_id].steps_enemy = 0;
    games[game_id].steps_user = 0;
    tmp_user = games[game_id].user;
    games[game_id].user = games[game_id].enemy;
    games[game_id].enemy = tmp_user;
    tmp = games[game_id].pl1;
    games[game_id].pl1 = games[game_id].pl2;
    games[game_id].pl2 = tmp;
    tmp_deck = games[game_id].pdeck1;
    games[game_id].pdeck1 = games[game_id].pdeck2;
    games[game_id].pdeck2 = tmp_deck;
    games[game_id].distribution();
}
FoolGame.endstep = function(game_id, user){
    if(user.id==games[game_id].user.id){
        if (games[game_id].turn)
            this.takeAll(game_id);
        else
            if ((games[game_id].board[0].length==games[game_id].board[1].length)&&(games[game_id].board[0].length!=0))
                this.drub(game_id);
    }
}
FoolGame.takeAll = function(game_id){
    games[game_id].steps_enemy = 0;
    games[game_id].steps_user = 0;
    games[game_id].pdeck2 = games[game_id].pdeck2.concat(union(games[game_id].board));
    games[game_id].pl2 = games[game_id].pdeck2.length-1;
    games[game_id].turn = 0;
    games[game_id].distribution();
}
FoolGame.take = function(game_id, enemy){
    if((enemy.id==games[game_id].enemy.id)&&(games[game_id].board[0].length)){
        games[game_id].turn = 1;
    }
}
