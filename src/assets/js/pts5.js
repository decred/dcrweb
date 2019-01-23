window.demoDescription = "A circle moves in a field of random points. If a point intersects with the circle, it grows bigger and moves slightly toward the circle's center.";

(function() {
  
  Pts.namespace( this );
  var space = new CanvasSpace("#pt5").setup({bgcolor: "#091440", resize: true, retina: true});
  var form = space.getForm();
  
  
  //// Demo code ---
  var pts = [];
  var colors = ["#2970FF", "#2DD8A3", "#FFC84D"];

  space.add( { 

    // init with  120 random points 
    start: (bound) => { pts = Create.distributeRandom( space.innerBound, 120 ); },

    animate: (time, ftime) => {
      let perpend = new Group( space.center.$subtract(0.1), space.pointer ).op( Line.perpendicularFromPt );
      

      let r = Math.abs( space.pointer.x-space.center.x )/space.center.x * 300 + 70;
      let range = Circle.fromCenter( space.pointer, r );
      
      // check if each point is within circle's range
      for (let i=0, len=pts.length; i<len; i++) {

        if ( Circle.withinBound( range, pts[i] ) ) {

          // calculate circle size
          let dist = (r - pts[i].$subtract(space.pointer).magnitude() ) / r;
          let p = pts[i].$subtract( space.pointer ).scale( 1+dist ).add( space.pointer );
          form.fill(false).stroke( colors[i%4] ).point( p, dist*25, "square" );
          
        } else {
          form.stroke("#fff").point(pts[i], 0.5);
        }

      }
    }

  });
  
  //// ----
  
  
  space.bindMouse().bindTouch().play();
  
})();