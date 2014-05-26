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
    // Игроки
    this.board = [[],[]];
    this.user = user;
    this.enemy = enemy;
    // Количество карт у каждого игрока
    this.x = x;
    this.y = y;
    this.pdeck1 = [];
    this.pdeck2 = [];
    // Кол-во сделанных ходов
    this.steps = 0;
    this.index = 0;
    // Кто ходит
    this.turn = 1;
}

GameItem.prototype.shuffle = function(){
    for(var j, x, i = this.deck.length; i; j = parseInt(Math.random() * i), x = this.deck[--i], this.deck[i] = this.deck[j], this.deck[j] = x);
};

GameItem.prototype.distribution=function(){
    if(this.turn){

        if(this.x<6){
            this.pdeck1=juciefroot(this.x,this.deck, this.index);
            this.index+=6-this.x;
            this.x = 5;
        }

        if(this.y<6){
            this.pdeck2=juciefroot(this.y,this.deck, this.index);
            this.index+=6-this.y;
            this.y = 5;
        }

    }else{

        if(this.y<6){
            this.pdeck2=juciefroot(this.y,this.deck, this.index);
            this.index+=6-this.y;
            this.y = 5;
        }
        if(this.x<6){
            this.pdeck1=juciefroot(this.x,this.deck, this.index);
                this.index+=6-this.x;
            this.x = 5;
        }
    }
    this.user.emit('distribution', this.pdeck1);
    this.enemy.emit('distribution', this.pdeck2);
}
FoolGame.CreateGame = function(game_id, user, enemy, x, y){
    var game = new GameItem(game_id,user,enemy,x,y);
    games[game_id]=game;
    games[game_id].distribution();

}
FoolGame.Step = function(game_id,id,user){
    if(games[game_id].turn)
        if (games[game_id].user.id != user.id){
            games[game_id].enemy.emit('card',id);
            games[game_id].user.emit('mycard',id);
            console.log('user');
        }
        console.log(games[game_id].board[0][0]=id);
        games[game_id].board[0][0]=id;
}
