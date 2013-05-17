// Fractal.js by Moisés Cachay

function setPixel(imageData, x, y, r, g, b) {
    _x = x + imageData.width/2
    _y = y + imageData.height/2
    index = (_x + _y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = 255;
}

function drawFractal(canvasid, maxIterations) {
    element = document.getElementById(canvasid);
    c = element.getContext('2d');

    width = element.width;
    height = element.height;

    imageData = c.createImageData(width, height);
    var x;
    var y;
    var iterations;

    for(x = -width/2; x <= width/2; x++) {
        for(y = -height/2; y <= height/2; y++) {
            iterations = 0;
            var C = new Complex(x * 4./width, y * 4./height);
            var Z = Complex.ZERO;

            while(Z.mag() < 2 && iterations < maxIterations) {
                Z = Z.mul(Z);
                Z = Z.add(C);
                iterations++;
            }

            if (iterations == maxIterations) {
                setPixel(imageData, x, y, 0, 0, 0);
            } else if (iterations < maxIterations/2 - 1) {
                setPixel(imageData, x, y, 0, 0, 40 - (100/iterations));
            } else {
                setPixel(imageData, x, y, 255/iterations, 255/iterations, 100);
            }
        }
    }

    c.putImageData(imageData, 0, 0);
}

