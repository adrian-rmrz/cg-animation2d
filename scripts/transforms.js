///////////////////////////////////////////////////////////////////////////////////
// 3x3 Transform Matrices                                                         //
///////////////////////////////////////////////////////////////////////////////////

// Set values of existing 3x3 matrix to the identity matrix
function mat3x3Identity(mat3x3) {
    mat3x3.values = [[1, 0, 0],
                     [0, 1, 0],
                     [0, 0, 1]];
}

// Set values of existing 3x3 matrix to the translate matrix
function mat3x3Translate(mat3x3, tx, ty) {
    mat3x3.values = [[1, 0, tx],
                     [0, 1, ty],
                     [0, 0, 1]];
    // mat3x3.values = ...;
}

// Set values of existing 3x3 matrix to the scale matrix
function mat3x3Scale(mat3x3, sx, sy) {
    mat3x3.values = [[sx, 0, 0],
                    [0, sy, 0],
                    [0, 0, 1]];
}

// Set values of existing 3x3 matrix to the rotate matrix
function mat3x3Rotate(mat3x3, theta) {
    mat3x3.values = [[Math.cos(degrees_to_radians(theta)), ((-1)*Math.sin(degrees_to_radians(theta))), 0],
                    [Math.sin(degrees_to_radians(theta)), Math.cos(degrees_to_radians(theta)), 0],
                    [0, 0, 1]];
}

// helper fucntion
function degrees_to_radians(degrees) {
    let pi = Math.PI;
    let radians = degrees * (pi/180);
    return radians;
}

// Create a new 3-component vector with values x,y,w
function Vector3(x, y, w) {
    let vec3 = new Matrix(3, 1);
    vec3.values = [x, y, w];
    return vec3;
}

