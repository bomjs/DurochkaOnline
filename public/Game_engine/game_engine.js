shuffle = function(mas){
    for(var j, x, i = mas.length; i; j = parseInt(Math.random() * i), x = mas[--i], mas[i] = mas[j], mas[j] = x);
    return mas;
};
alert(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
// create the Scene object
shuffle = function(mas){
    for(var j, x, i = mas.length; i; j = parseInt(Math.random() * i), x = mas[--i], mas[i] = mas[j], mas[j] = x);
    return mas;
};

window.onload=function(){
    var player_cards=document.getElementById('player_cards');
    var enemy_cards=document.getElementById('enemy_card');
    var cards=[52];
    for (var i=0; i<52; i++){
        cards[i]=i;
    }
    shuffle(cards);
    var i, j,index = 0, n,dy,dyy,dx,dxx, h,w;
    h=74;
    w=52.61;
    dy=14;
    dyy=3;
    dx=23;
    dxx=4;
    for (k = 0; k < 6; k++){
        n = cards[index];
        j = Math.floor(n/13);
        i = n-13*j;
        var card = document.createElement('div');
        card.className='cards';
        card.id=cards[index];
        card.onclick=function(){
            alert('you click me!!!\n My id = '+ (this).id);
        }
        player_cards.appendChild(card);
        card.style.backgroundPosition = ((-1)*(dy+w*i+dyy*(i-1)))+"px "+(-1*(dx+h*j+dxx*(j-1)))+"px";
        index++;
    };
    for (k = 0; k < 6; k++){
        var enemy_card = document.createElement('div');
        enemy_card.className='enemy_cards';
        enemy_cards.appendChild(enemy_card);
        enemy_card.style.backgroundPosition = ((-1)*(dy+w*13+dyy*(13-1)))+"px "+(-1*(dx+h*2+dxx*(2-1)))+"px";
    };

}
