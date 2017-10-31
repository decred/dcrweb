(function() {
  
  Pts.namespace( this );
  var space = new CanvasSpace("#pt4").setup({bgcolor: "#091440", resize: true, retina: true});
  var form = space.getForm();
  
  
  //// Demo code ---
  
  space.add( (time, ftime) => {

    // get a line from pointer to center, and use it for direction and magnitude calculations
    let ln = space.pointer.$subtract( space.center.$add(0.1) );
    let dir = ln.$unit();
    let mag = ln.magnitude();
    let mag2 = space.size.magnitude();

    // create a grid of lines
    let lines = Create.gridPts( space.innerBound, 20, 10 ).map( (p) => {
      let dist = p.$subtract( space.center ).magnitude() / mag2;
      return new Group(p, p.$add( dir.$multiply( dist*(20 + mag/5) ) )) 
    });
    
    //form.strokeOnly("#fe3").line( [space.center, space.pointer] );
    form.strokeOnly("#2970FF").lines( lines );
  });
  
  //// ----
  
  
  space.bindMouse().bindTouch().play();
  
})();