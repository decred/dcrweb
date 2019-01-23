(function() {
  
  Pts.namespace( this );
  var space = new CanvasSpace("#pt2").setup({bgcolor: "#091440", resize: true, retina: true});
  var form = space.getForm();
  
  
  //// Demo code ---
  var lines = [];

  // function to create random lines
  var createLines = () => {
    lines = [];
    var ps = Create.distributeRandom( space.innerBound, 50 );
    for (let i=0, len=ps.length; i<len; i++) {
      lines.push( new Group( ps[i], ps[i].clone().toAngle( Math.random()*Const.pi, Math.random()*space.size.y/2+20, true) ) );
    }
  };
  
  space.add({ 
    start: (bound) => { createLines(); },
    resize: (bound) => { createLines(); },
    
    animate: (time, ftime) => {
      
      // define a range from the pointer
      let range = Circle.fromCenter( space.pointer, 100 );
      form.stroke( "#2970FF" ).lines( lines );
      
      for (let i=0, len=lines.length; i<len; i++) {

        // check rays and lines intersection with pointer's range
        let inPath = Circle.intersectRay2D( range, lines[i] );
        let inLine = Circle.intersectLine2D( range, lines[i] );

        if (inPath.length > 1) {
          form.stroke("rgba(255,255,255,.15)").line( lines[i].concat(inPath[0], inPath[1]) );
          form.stroke("#2970FF").line( lines[i] );
          form.fillOnly("#fff").points( inPath, 1, "circle" );
        }

        if (inLine.length > 0) {
          form.stroke("#3AD7A4").line( lines[i] );
          form.fillOnly("#3AD7A4").points( inLine, 3, "circle" );
        }
      }
    }

  });
  
  //// ----
  
  
  space.bindMouse().bindTouch().play();
  
})();