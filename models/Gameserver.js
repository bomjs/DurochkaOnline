var games = [];
function juciefroot(x, deck, index){
    var pdeck=[];
    if(x<6){
        for(var i= index; i<index+(6-x); i++){
            pdeck[i-index] = deck[index+i];
        }
    }
    return pdeck;
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
    this.steps = 0;
    this.index = 0;
    // Кто ходит
    this.turn = 0;
}

GameItem.prototype.shuffle = function(){
    for(var j, x, i = this.deck.length; i; j = parseInt(Math.random() * i), x = this.deck[--i], this.deck[i] = this.deck[j], this.deck[j] = x);
};

GameItem.prototype.distribution=function(){
    if(this.turn){
        if(this.pl1<6){
            this.pdeck1=juciefroot(this.pl1,this.deck, this.index);
            this.index+=6-this.pl1;
            this.pl1 = 5;
        }

        if(this.pl2<6){
            this.pdeck2=juciefroot(this.pl2,this.deck, this.index);
            this.index+=6-this.pl2;
            this.pl2 = 5;
        }
    }else{
        if(this.pl2<6){
            this.pdeck2=juciefroot(this.pl2,this.deck, this.index);
            this.index+=6-this.pl2;
            this.pl2 = 5;
        }
        if(this.pl1<6){
            this.pdeck1=juciefroot(this.pl1,this.deck, this.index);
            this.index+=6-this.pl1;
            this.pl1 = 5;
        }
    }
    this.user.emit('distribution', this.pdeck1, this.pdeck2.length);
    this.enemy.emit('distribution', this.pdeck2, this.pdeck1.length);
    console.log(this.pdeck1+" x= "+this.pl1+" y="+this.pl2+" index = "+this.index);
    console.log(this.pdeck2+" x= "+this.pl1+" y="+this.pl2+" index = "+this.index);
}
FoolGame.CreateGame = function(game_id, user, enemy, x, y){
    var game = new GameItem(game_id,user,enemy,x,y);
    games[game_id]=game;
    games[game_id].distribution();
    games[game_id].user.emit('advantage',games[game_id].advantage);
    games[game_id].enemy.emit('advantage',games[game_id].advantage);
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
    var i = id_card-13*j;
    return i;
}
mastcard = function(id_card){
    var j = Math.floor(id_card/13);
    return j;
}

trycover = function(game_id, id){
    console.log(games[game_id].advantage);
    console.log(mastcard(id));
    var card = games[game_id].board[0][games[game_id].board[1].length];
    if((mastcard(card)==mastcard(id))&&(numcard(card)<numcard(id))){
            games[game_id].pdeck2.splice(games[game_id].pdeck2.indexOf(id), 1);
            return true;
    }
    if ((mastcard(games[game_id].advantage)==mastcard(id))&&((mastcard(card)!=mastcard(id)))){
        games[game_id].pdeck2.splice(games[game_id].pdeck2.indexOf(id), 1);
        return true;
    }
    return false;
}

tryput = function(game_id,id){
    games[game_id].pdeck1.splice(games[game_id].pdeck1.indexOf(id), 1);
    if(games[game_id].board[0].length){
    for(i=0; i<games[game_id].board[0].length;i++){
           if(numcard(id)==numcard(games[game_id].board[0][i])){
               console.log(numcard(games[game_id].board[0][i]));
               console.log(numcard(id));
               return true;
           }
        }
    for(i=0; i<games[game_id].board[1].length;i++){
        if(numcard(id)==numcard(games[game_id].board[1][i])){
            console.log(numcard(games[game_id].board[1][i]));
            console.log(numcard(id));
            return true;
        }
    }
            return false;
    }else{
        return true;
    }
}

FoolGame.Step = function(game_id,id,user){
    console.log(games[game_id].advantage);
        if((games[game_id].turn==0)&&(games[game_id].user.id == user.id)&&(tryput(game_id,id)))
        {
            games[game_id].enemy.emit('step_enemy',id,games[game_id].pl1);
            games[game_id].user.emit('step_user',id);
            games[game_id].pl1--;
            games[game_id].board[0][games[game_id].steps]=id;
            games[game_id].steps++;
            console.log("x12= "+games[game_id].pl1);
        }
        if((games[game_id].turn!=0)&&(games[game_id].enemy.id == user.id)&&(trycover(game_id,id)))
        {
            games[game_id].user.emit('step_enemy',id,games[game_id].pl2);
            games[game_id].enemy.emit('step_user',id);
            games[game_id].pl2--;
            games[game_id].board[1][games[game_id].steps]=id;
            games[game_id].steps++;
            if(games[game_id].board[1].length == games[game_id].board[0].length){
                games[game_id].turn = 0;
            }
            console.log("y12="+games[game_id].pl2);

        }
   console.log(games[game_id].board);
   console.log(id);
}

FoolGame.endstep = function(game_id, user){
    if(user.id==games[game_id].user.id){
    (games[game_id].turn!=0 ? games[game_id].turn=0 : games[game_id].turn=1);
        games[game_id].steps = 0;
    console.log('endstep '+games[game_id].turn);
    }
}
FoolGame.takeAll = function(game_id, enemy){
    if(enemy.id==games[game_id].enemy.id){
        games[game_id].pdeck2 = games[game_id].pdeck2.concat(union(games[game_id].board));
        games[game_id].pl2+=union(games[game_id].board).length;
        games[game_id].enemy.emit('take', games[game_id].pdeck2);
        games[game_id].distribution();
    }
}
