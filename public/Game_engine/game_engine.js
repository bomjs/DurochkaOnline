
shuffle = function(mas){
    for(var j, x, i = mas.length; i; j = parseInt(Math.random() * i), x = mas[--i], mas[i] = mas[j], mas[j] = x);
    return mas;
};

alert(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));