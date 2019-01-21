(function() {

  Pts.namespace( this );
  var space = new CanvasSpace("#pt4").setup({bgcolor: "#091440", resize: true, retina: true});
  var form = space.getForm();


  //// Demo code ---

  var pairs = [];

  space.add({ 

    start:( bound ) => {
      let r = space.size.maxValue().value/2;

      // create 200 lines
      for (let i=0; i<45; i++) {
        let ln = new Group( Pt.make(2, r, true), Pt.make(2, -r, true) );
        ln.moveBy( space.center ).rotate2D( i*Math.PI/50, space.center );
        pairs.push( ln );
      }
    }, 

    animate: (time, ftime) => {

      for (let i=0, len=pairs.length; i<len; i++) {

        let ln = pairs[i];
        ln.rotate2D( Const.one_degree/70, space.center );
        let collinear = Line.collinear( ln[0], ln[1], space.pointer, 2);

        if (collinear) {
          form.stroke("rgba(255,255,255, .5)").line(ln);

        } else {
          // if not collinear, color the line based on whether the pointer is on left or right side
          let side = Line.sideOfPt2D( ln, space.pointer );
          form.stroke( (side<0) ? "rgba(41,112,255, .3)" : "rgba(45,216,163, .3)" ).line( ln, 3 );
        }
        form.fillOnly("#fff").points( ln, 1);
      }

      form.fillOnly("#ED6D47");
      
    }

  });
  
  //// ----
  

  space.bindMouse().bindTouch().play();

})();