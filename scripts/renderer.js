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

                this.ballXVel = 0.5 * delta_time *this.ballXFlip;
                this.ballYVel = 0.5 * delta_time *this.ballYFlip;
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
                // Spinning
                let squareTranslate1 = new Matrix(3, 3);
                mat3x3Translate(squareTranslate1, -100, -100);

                let squareRotate = new Matrix(3, 3);
                mat3x3Rotate(squareRotate, 15);

                let squareTranslate2 = new Matrix(3, 3);
                mat3x3Translate(squareTranslate2, 100, 100);

                for (let i = 0; i < this.square.length; i++) {
                    let val = Matrix.multiply([squareTranslate2, squareRotate, squareTranslate1, this.square[i]]);
                    let newSquareX = parseFloat(val.values[0]);
                    let newSquareY = parseFloat(val.values[1]);
                    let squareNewPoint = [newSquareX, newSquareY, 1];
                    this.square[i].values = squareNewPoint;

                }

                console.log(this.square);
                break;
            case 2:
                //Scalling
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
    
        let diamond = [
            Vector3(150, 375, 1),
            Vector3(200, 450, 1),
            Vector3(150, 575, 1),
            Vector3(100, 450, 1)
        ];

        let midDiamondx = 150;
        let midDiamondy = 475;

        let teal = [0, 128, 128, 255];
        this.drawConvexPolygon(diamond, teal);

        
        let squareMidx = 650;
        let squareMidy = 450;

        let color = [100, 0, 255, 255];
        this.drawConvexPolygon(this.square, color);

        let triange = [
            Vector3(400, 100, 1),
            Vector3(500, 100, 1),
            Vector3(450, 250, 1)
        ];

        let triangleMidx = 450;
        let triangleMidy = 175;

        let col = [240, 120, 66, 255];
        this.drawConvexPolygon(triange, col);

    }

    //
    drawSlide2() {
        // TODO: draw at least 2 polygons grow and shrink about their own centers
        //   - have each polygon grow / shrink different sizes
        //   - try at least 1 polygon that grows / shrinks non-uniformly in the x and y directions


    }

    //
    drawSlide3() {
        // TODO: get creative!
        //   - animation should involve all three basic transformation types
        //     (translation, scaling, and rotation)
        
        //
        
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