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
    var player_cards_1=document.getElementById('player_cards_1');
    var cards=[52];
    for (var i=0; i<52; i++){
        cards[i]=i;
    }
    var i, j,index = 0, n,dy,dyy,dx,dxx, h,w;
    h=74;
    w=52.61;
    dy=14;
    dyy=3;
    dx=23;
    dxx=4;
    for (var k = 0; k < 6; k++){
        shuffle(cards);
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
}
