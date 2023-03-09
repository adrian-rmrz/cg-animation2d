class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // limit_fps_flag:      bool 
    // fps:                 int
    constructor(canvas, limit_fps_flag, fps) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.limit_fps = limit_fps_flag;
        this.fps = fps;
        this.start_time = null;
        this.prev_time = null;

        //Slide0
        this.ballMid = Vector3(400, 300, 1);
        this.ballXFlip = 1;
        this.ballYFlip = 1;
        this.ballXVel = 1;
        this.ballYVel = 1;

        //Slide1
        this.square = [
            Vector3(600, 400, 1),
            Vector3(700, 400, 1),
            Vector3(700, 500, 1),
            Vector3(600, 500, 1)
        ];

        this.diamond = [
            Vector3(150, 375, 1),
            Vector3(200, 450, 1),
            Vector3(150, 575, 1),
            Vector3(100, 450, 1)
        ];

        this.triangle = [
            Vector3(400, 100, 1),
            Vector3(500, 100, 1),
            Vector3(450, 250, 1)
        ];

        //Slide2
        this.diamond1 = [
            new Vector3(200, 150, 1),
            new Vector3(220, 200, 1),
            new Vector3(200, 400, 1),
            new Vector3(180, 200, 1)
        ];

        this.box = [
            new Vector3(500, 400, 1),
            new Vector3(700, 400, 1),
            new Vector3(700, 500, 1),
            new Vector3(500, 500, 1)
        ];

        this.boxScale = new Matrix(3,3);
        this.diamond1Scale = new Matrix(3,3);

        this.boxXScale = 1;
        this.boxYScale = 1;

        this.diamond1XScale = 1;
        this.diamond1YScale = 1;
    }

    // flag:  bool
    limitFps(flag) {
        this.limit_fps = flag;
    }

    // n:  int
    setFps(n) {
        this.fps = n;
    }

    // idx: int
    setSlideIndex(idx) {
        this.slide_idx = idx;
    }

    animate(timestamp) {
        // Get time and delta time for animation
        if (this.start_time === null) {
            this.start_time = timestamp;
            this.prev_time = timestamp;
        }
        let time = timestamp - this.start_time;
        let delta_time = timestamp - this.prev_time;
        //console.log('animate(): t = ' + time.toFixed(1) + ', dt = ' + delta_time.toFixed(1));

        // Update transforms for animation
        this.updateTransforms(time, delta_time);

        // Draw slide
        this.drawSlide();

        // Invoke call for next frame in animation
        if (this.limit_fps) {
            setTimeout(() => {
                window.requestAnimationFrame((ts) => {
                    this.animate(ts);
                });
            }, Math.floor(1000.0 / this.fps));
        }
        else {
            window.requestAnimationFrame((ts) => {
                this.animate(ts);
            });
        }

        // Update previous time to current one for next calculation of delta time
        this.prev_time = timestamp;
    }

    //
    updateTransforms(time, delta_time) {
        // TODO: update any transformations needed for animation
        switch (this.slide_idx) {
            case 0:
                // Translate
                if (this.ballMid.values[0] >= (this.canvas.width-50)) {
                    this.ballXFlip = -1;
                } else if (this.ballMid.values[0] <= 50) {
                    this.ballXFlip = 1;
                }
                
                if (this.ballMid.values[1] >= (this.canvas.height-50)) {
                    this.ballYFlip = -1;
                } else if (this.ballMid.values[1] <= 100) {
                    this.ballYFlip = 1;
                }

                let translate = new Matrix(3, 3);

                this.ballXVel = 0.1 * delta_time * this.ballXFlip;
                this.ballYVel = 0.1 * delta_time * this.ballYFlip;
                mat3x3Translate(translate, this.ballXVel, this.ballYVel);

                //console.log("translate: " + translate.values);
                //console.log("Ball: " + this.ballMid.values);
                
                let val = Matrix.multiply([translate, this.ballMid]);

                //console.log("Val: " + val.values);

                let newX = parseFloat(val.values[0]);
                let newY = parseFloat(val.values[1]);
                let newPoint = [newX, newY, 1];

                //console.log("newX: " + newX);
                //console.log("xVel: " + this.ballXVel);
                //console.log("newY: " + newY);
                //console.log("yVel: " + this.ballYVel);
                //console.log("newPoint: " + newPoint);
                //console.log("Ball: " + this.ballMid.values);
                

                this.ballMid.values = newPoint;

                //console.log("xFlip: " + this.ballXFlip);
                //console.log("yFlip: " + this.ballYFlip);

                break;
            case 1:
                //Spinning

                // Square
                let squareTranslate1 = new Matrix(3, 3);
                mat3x3Translate(squareTranslate1, -650, -450);
        
                let squareRotate = new Matrix(3,3);
                mat3x3Rotate(squareRotate, (0.01*delta_time));
        
                let squareTranslate2 = new Matrix(3, 3);
                mat3x3Translate(squareTranslate2, 650, 450);

                // Diamond 
                let diamondTranslate1 = new Matrix(3, 3);
                mat3x3Translate(diamondTranslate1, -150, -475);
        
                let diamondRotate = new Matrix(3,3);
                mat3x3Rotate(diamondRotate, (-0.01*delta_time));
        
                let diamondTranslate2 = new Matrix(3, 3);
                mat3x3Translate(diamondTranslate2, 150, 475);

                // Triangle
                let triangleTranslate1 = new Matrix(3, 3);
                mat3x3Translate(triangleTranslate1, -450, -175);
        
                let triangleRotate = new Matrix(3,3);
                mat3x3Rotate(triangleRotate, (0.05*delta_time));
        
                let triangleTranslate2 = new Matrix(3, 3);
                mat3x3Translate(triangleTranslate2, 450, 175);
        
                for (let i = 0; i < this.square.length; i++) {
                    /*
                    console.log("===Square[i]====: " + this.square[i].values);
                    console.log("Mult: " + Matrix.multiply([squareTranslate1, this.square[i]]).values);
                    */

                    let val = Matrix.multiply([squareTranslate2, squareRotate, squareTranslate1, this.square[i]]);
                    let squareNewX = parseFloat(val.values[0]);
                    let squareNewY = parseFloat(val.values[1]);
                    let squareNewPoint = [squareNewX, squareNewY, 1]
                    this.square[i].values = squareNewPoint;

                    /*
                    console.log("i: " + i);
                    console.log("tran1: " + tran1.values);
                    console.log("rot: " + rot.values);
                    console.log("tran2: " + tran2.values);
                    console.log("squareNewX: " + squareNewX);
                    console.log("squareNewY: " + squareNewY);
                    console.log("squareNewPoint: " + squareNewPoint);
                    console.log("square[i]: " + this.square[i].values);
                    */
                }

                for (let i = 0; i < this.diamond.length; i++) {
                    let val = Matrix.multiply([diamondTranslate2, diamondRotate, diamondTranslate1, this.diamond[i]]);
                    let diamondNewX = parseFloat(val.values[0]);
                    let diamondNewY = parseFloat(val.values[1]);
                    let diamondNewPoint = [diamondNewX, diamondNewY, 1]
                    this.diamond[i].values = diamondNewPoint;

                }

                for (let i = 0; i < this.triangle.length; i++) {
                    let val = Matrix.multiply([triangleTranslate2, triangleRotate, triangleTranslate1, this.triangle[i]]);
                    let triangleNewX = parseFloat(val.values[0]);
                    let triangleNewY = parseFloat(val.values[1]);
                    let triangleNewPoint = [triangleNewX, triangleNewY, 1]
                    this.triangle[i].values = triangleNewPoint;

                }
        
                break;
            case 2:
                //Scaling

                let boxTranslate1 = new Matrix(3, 3);
                mat3x3Translate(boxTranslate1, -600, -450);

                let boxTranslate2 = new Matrix(3, 3);
                mat3x3Translate(boxTranslate2, 600, 450);
                
                let boxWidth = this.box[1].values[0] - this.box[3].values[0];

                if (boxWidth >= 200) {
                    this.boxXScale = 0.9995;
                    this.boxYScale = 0.9995;
                } else if (boxWidth <= 50) {
                    this.boxXScale = 1.0005;
                    this.boxYScale = 1.0005;
                }

                mat3x3Scale(this.boxScale, Math.pow(this.boxXScale, delta_time), Math.pow(this.boxYScale, delta_time));

                for (let i = 0; i < this.box.length; i++) {
                    let val = Matrix.multiply([boxTranslate2, this.boxScale, boxTranslate1, this.box[i]]);
                    let newBoxX = val.values[0][0];
                    let newBoxY = val.values[1][0];
                    this.box[i].values = [newBoxX, newBoxY, 1];
                }

                let diamond1Translate = new Matrix(3, 3);
                mat3x3Translate(diamond1Translate, -200, -275);

                let diamond1Translate2 = new Matrix(3, 3);
                mat3x3Translate(diamond1Translate2, 200, 275);

                let diamond1Width = this.diamond1[1].values[0] - this.diamond1[3].values[0];
                let diamond1Height = this.diamond1[2].values[1] - this.diamond1[0].values[1];

                if (diamond1Width >= 200) {
                    this.diamond1XScale = 0.995;
                } else if (diamond1Width <= 50) {
                    this.diamond1XScale = 1.005;
                }

                if (diamond1Height >= 200) {
                    this.diamond1YScale = 0.99;
                } else if (diamond1Height <= 50) {
                    this.diamond1YScale = 1.0005;
                }

                mat3x3Scale(this.diamond1Scale, Math.pow(this.diamond1XScale, delta_time), Math.pow(this.diamond1YScale, delta_time));

                console.log("diamond1Width: " + diamond1Width);
                console.log("diamond1Scale: " + this.diamond1Scale.values);

                for (let i = 0; i < this.diamond.length; i++) {
                    let val = Matrix.multiply([diamond1Translate2, this.diamond1Scale, diamond1Translate, this.diamond1[i]]);
                    let newDiamondX = val.values[0][0];
                    let newDiamondY = val.values[1][0];
                    this.diamond1[i].values = [newDiamondX, newDiamondY, 1];
                }

                break;
            case 3:
                // Fun stuff
                break;
        }

 
    }
    
    //
    drawSlide() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0();
                break;
            case 1:
                this.drawSlide1();
                break;
            case 2:
                this.drawSlide2();
                break;
            case 3:
                this.drawSlide3();
                break;
        }
    }

    //
    drawSlide0() {
        // TODO: draw bouncing ball (circle that changes direction whenever it hits an edge)

        let x = parseFloat(this.ballMid.values[0]);
        let y = parseFloat(this.ballMid.values[1]);

        let ball = [
            new Vector3(x-(-50), y, 1),
            new Vector3(x-(-49), y+11, 1),
            new Vector3(x-(-45), y+22, 1),
            new Vector3(x-(-39), y+31, 1),
            new Vector3(x-(-31), y+39, 1),
            new Vector3(x-(-22), y+45, 1),
            new Vector3(x-(-11), y+49, 1),
            new Vector3(x, y+50, 1),
            new Vector3(x-11, y+49, 1),
            new Vector3(x-22, y+45, 1),
            new Vector3(x-31, y+39, 1),
            new Vector3(x-39, y+31, 1),
            new Vector3(x-45, y+22, 1),
            new Vector3(x-49, y+11, 1),
            new Vector3(x-50, y, 1),
            new Vector3(x-49, y-11, 1),
            new Vector3(x-45, y-22, 1),
            new Vector3(x-39, y-31, 1),
            new Vector3(x-31, y-39, 1),
            new Vector3(x-22, y-45, 1),
            new Vector3(x-11, y-49, 1),
            new Vector3(x, y-50, 1),
            new Vector3(x-(-11), y-49, 1),
            new Vector3(x-(-22), y-45, 1),
            new Vector3(x-(-31), y-39, 1),
            new Vector3(x-(-39), y-31, 1),
            new Vector3(x-(-45), y-22, 1),
            new Vector3(x-(-49), y-11, 1)
           ];
        
        let red = [255, 0, 0, 255];
        this.drawConvexPolygon(ball, red);
        // Need to implement circle thing

    }

    //
    drawSlide1() {
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction
    
        // TODO: draw at least 3 polygons that spin about their own centers
        //   - have each polygon spin at a different speed / direction

        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(this.diamond, teal);


        let color = [100, 0, 255, 255];

        this.drawConvexPolygon(this.square, color);

        let triangleMidx = 450;
        let triangleMidy = 175;

        let col = [240, 120, 66, 255];
        this.drawConvexPolygon(this.triangle, col);
    }


    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions

        let green = [0, 205, 50, 255];
        //Grow in X
        this.drawConvexPolygon(this.diamond1, green);

        let color = [255, 248, 180, 255];
        this.drawConvexPolygon(this.box, color);
    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        
    }
    
    // vertex_list:  array of object [Matrix(3, 1), Matrix(3, 1), ..., Matrix(3, 1)]
    // color:        array of int [R, G, B, A]
    drawConvexPolygon(vertex_list, color) {
        this.ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
        this.ctx.beginPath();
        let x = vertex_list[0].values[0][0] / vertex_list[0].values[2][0];
        let y = vertex_list[0].values[1][0] / vertex_list[0].values[2][0];
        this.ctx.moveTo(x, y);
        for (let i = 1; i < vertex_list.length; i++) {
            x = vertex_list[i].values[0][0] / vertex_list[i].values[2][0];
            y = vertex_list[i].values[1][0] / vertex_list[i].values[2][0];
            this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

};
