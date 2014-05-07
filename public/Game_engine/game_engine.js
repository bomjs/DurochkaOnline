//shuffle = function(mas){
//    for(var j, x, i = mas.length; i; j = parseInt(Math.random() * i), x = mas[--i], mas[i] = mas[j], mas[j] = x);
//    return mas;
//};
//alert(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
// create the Scene object

var scene = sjs.Scene({w:640, h:480});

// load the images in parallel. When all the images are
// ready, the callback function is called.

scene.loadImages(['/resourse/field.png'], function() {
    var table;
    table = scene.Sprite('/resourse/field.png');
    table.size(640,480);
    table.update();
    table.background();
});
scene.loadImages(['/resourse/sourse.png'],function() {
    // create the Sprite object;
    var karts=[];
    for(var i=0;i<4;i++){
        for(var j=0;j<13;j++){
            karts[j+(i*13)] = scene.Sprite('/resourse/sourse.png');
            karts[j+(i*13)].size(43, 60);
            karts[j+(i*13)].offset(j*46,i*60);
            karts[j+(i*13)].update();
            karts[j+(i*13)].move(j*40+65,i*60+120);
            karts[j+(i*13)].update();
        }
    }
//
//
//    var sp = scene.Sprite('/resourse/sourse.png');
//    // change the visible size of the sprite
//    sp.size(39, 55);
//    // apply the latest visual changes to the sprite
//    // (draw if canvas, update attribute if DOM);
//    sp.update();
//
//    // change the offset of the image in the sprite
//    // (this works the opposite way of a CSS background)
//    sp.offset(47,0);
//    sp.update();
//    // various transformations
//    sp.move(160,120);
//    sp.update();
//    //sp.position(500, -50);
////     sp.rotate(3.14 / 4);
////     sp.scale(2);
////     sp.setOpacity(0.8);
//

});