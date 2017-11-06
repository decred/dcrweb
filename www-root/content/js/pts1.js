(function() {

  Pts.namespace( this );
  var space = new CanvasSpace("#pt1").setup({bgcolor: "#091440", resize: true, retina: true});
  var form = space.getForm();


  //// Demo code ---

  var pts = new Group();

  space.add({ 

    // creatr 200 random points
    start:( bound ) => {
      pts = Create.distributeRandom( space.innerBound, 200 );
    }, 

    animate: (time, ftime) => {
      // make a line and turn it into an "op" (see the guide on Op for more)
      let perpend = new Group( space.center.$subtract(0.1), space.pointer ).op( Line.perpendicularFromPt );
      pts.rotate2D( 0.0005, space.center );

      pts.forEach( (p, i) => {
        // for each point, find the perpendicular to the line
        let lp = perpend( p );
        var ratio = Math.min( 1, 1 - lp.$subtract(p).magnitude()/(space.size.x/2) );
        form.stroke(`rgba(41,112,255,${ratio}`, ratio*2).line( [ p, lp ] );
        form.fillOnly( ["#3AD7A4", "#3AD7A4", "#3AD7A4"][i%3] ).point( p, 1 );
      });
    },

  });
  
  //// ----
  

  space.bindMouse().bindTouch().play();

})();