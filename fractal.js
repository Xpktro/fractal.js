// setPixel, some parts of drawFractal and Canvas enlightment
// extracted from http://beej.us/blog/data/html5s-canvas-2-pixel/
function setPixel(imageData, x, y, r, g, b) {
    // Since we're drawing against a "complex" plane, we need to set
    // X and Y coordinates relative to the center of the image.
    _x = x + imageData.width/2
    _y = y + imageData.height/2

    // imageData is an array of elements (grouped in tuples of 4)
    // that represent each pixel R, G, B and Alpha values.
    index = (_x + _y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = 255;
}

// None of this work would be possible without the impressive python implementation of the
// 'CurtreMandelbrot' experiment (which some parts I ported here) described in
// http://sigloxxi.fcie.uam.es/maquinaciones/fractales-python-cuda-mandelbrot
function drawFractal(canvasid, maxIterations) {
    element = document.getElementById(canvasid);
    c = element.getContext('2d');

    width = element.width;
    height = element.height;

    imageData = c.createImageData(width, height);
    var x;
    var y;

    var iterations;

    // We iterate all over the complex plane
    for(x = -width/2; x <= width/2; x++) {
        for(y =- height/2; y <= height/2; y++) {

            // The fractal generation algorithm uses the Mandelbrot set definition
            // where a complex number will be part of it if it makes the function:
            // f(z) = z^2 + C (being C the complex number) applied over itself do not
            // tend to infinity.

            //In practical terms:
            iterations = 0;
            // Our C number will be within the printable plane (and we need to apply
            // some zoom since the fractal doesn't go over than 2 units from the center).
            var C = new Complex(x * 4./width, y * 4./height);

            // And we start iterating over the formulae:
            var Z = Complex.ZERO;

            // It's well known that the series will tend to infinity if the magnitude
            // of Z is bigger than 2 in less than 40 iterations (a bigger iteration
            // number will mean a better resolution):
            while(Z.mag() < 2 && iterations < maxIterations) {
                Z = Z.mul(Z);
                Z = Z.add(C);
                iterations++;
            }

            // So this C number will be part of the Mandelbrot set if we finish the
            // iterations and nothing more happens, in this case we fill those numbers
            // in the plane with a solid color (usually black).
            if (iterations == maxIterations) {
                setPixel(imageData, x, y, 0, 0, 0);

            // However the other numbers in our plane that did't met the avobe condition
            // can be used to color the borders of the fractal, so we use the number of
            // iterations we made over the series as a factor to paint the pixels.
            // Note: Color ruleset based on the one described in http://warp.povusers.org/Mandelbrot/
            } else if (iterations < maxIterations/2 - 1) {
                setPixel(imageData, x, y, 0, 0, 40 - (100/iterations));
            } else {
                setPixel(imageData, x, y, 255/iterations, 255/iterations, 100);
            }
        }
    }

    // Finally we dump the image buffer into the canvas, and the magic is done.
    c.putImageData(imageData, 0, 0);
}

