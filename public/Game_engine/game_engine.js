shuffle = function(mas){
    for(var j, x, i = mas.length; i; j = parseInt(Math.random() * i), x = mas[--i], mas[i] = mas[j], mas[j] = x);
    return mas;
};
alert(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
// create the Scene object

var scene = sjs.Scene({w:594, h:240});

// load the images in parallel. When all the images are
// ready, the callback function is called.

scene.loadImages(['/resourse/sourse.png'], function() {

    // create the Sprite object;
    var sp = scene.Sprite('/resourse/sourse.png');
    var sp1 = scene.Sprite('/resourse/sourse.png');
    // change the visible size of the sprite
    sp.size(39, 55);
    sp1.size(39, 55);
    // apply the latest visual changes to the sprite
    // (draw if canvas, update attribute if DOM);
    sp.update();
    sp1.offset(2*46,0);
    sp1.update();
    // change the offset of the image in the sprite
    // (this works the opposite way of a CSS background)
    sp.offset(47,0);
    sp.update();
    // various transformations
    sp.move(200,60);
    //sp.position(500, -50);
//     sp.rotate(3.14 / 4);
//     sp.scale(2);
//     sp.setOpacity(0.8);

     sp.update();
});