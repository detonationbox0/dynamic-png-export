
var stage;

/*
    Output Size: 4500W x 6000H    
    Canvas Size: 375W x 500H
    Ratio: 3:4
*/

var stageWidth = 375;
var stageHeight = 500;

/** -------------------------------------------------------------
 * DOCUMENT IS READY
 * Instantiate Konva
  ------------------------------------------------------------- */
$(function() {

    console.log("Hello.");

    stage = new Konva.Stage({
      container: 'konva',
      width: stageWidth,
      height: stageHeight,
    });

    stage.container().style.borderStyle = 'solid';    

    var layer = new Konva.Layer();

    var circle = new Konva.Circle({
      x: stage.width() / 2,
      y: stage.height() / 2,
      radius: 70,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 4,
    });

    // add the shape to the layer
    layer.add(circle);

    // add the layer to the stage
    stage.add(layer);
   

});


/** -------------------------------------------------------------
 * The container div is resized -  jQuery UI
 * ------------------------------------------------------------
 * Scale the Konva stage to fit into the DIV
 */
$( "#container" ).resizable({
  resize: function( event, ui ) {
    // ON RESIZE
    // Resize Konva to it's container
    fitStageIntoParentContainer();

  }
});


/** --------------------------------------------------------------
 * Reference:
 * https://konvajs.org/docs/sandbox/Responsive_Canvas.html
 * See Luca Benini's comment for "uniform stretch"
 *  --------------------------------------------------------------- */

function fitStageIntoParentContainer() {

  var container = document.querySelector('#container');

  // now we need to fit stage into parent container
  var containerWidth = container.offsetWidth;
  var containerHeight = container.offsetHeight;

  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  var scaleX = containerWidth / stageWidth;
  var scaleY =  containerHeight / stageHeight;


  

  // "uniform stretch"
  scaleX = scaleY = Math.min(scaleX , scaleY);

  // We should resize the stage to this:
  var newStageWidth = stageWidth * scaleX;
  var newStageHeight = stageHeight * scaleY;

  /**
   * The Ratio between the output width and height must be 3:4
   * Otherwise we get wierd output sizes like 4499 x 6000
   */

  // What is the ratio between the new stage width and new stage height?
  var ratio = calculateRatio(newStageWidth, newStageHeight);

  // Grab the output properties based on the new stage width
  var outProps = getOutputProperties(newStageWidth, newStageHeight);

  // Update DOM 
  $("#cnv-pixel-ratio").text(`Pixel Ratio: ${outProps.pixelRatio}`);
  $("#cnv-width").text(`Output Width: ${outProps.outputWidth}`);
  $("#cnv-height").text(`Output Height: ${outProps.outputHeight}`);
  $("#cnv-ratio").text(`Ratio: ${ratio}`);

  if (ratio != "3:4") {
    
    $(".canvas-info-color").css("color","black");

    return;
  } else {

    // It's 3:4, output should be good.

    $(".canvas-info-color").css("color","green");

    stage.width(newStageWidth);
    stage.height(newStageHeight);
    stage.scale({ x: scaleX, y: scaleY });
    stage.draw();

  }

}

/** --------------------------------------------------------------
 * User clicks the Export button
 * --------------------------------------------------------------- */
$("#export").on("click", function() {

  // Grab the ratio from the output properties
  var pR = getOutputProperties(stage.width(), stage.height()).pixelRatio;

  // See: https://konvajs.org/docs/data_and_serialization/High-Quality-Export.html
  var dataURL = stage.toDataURL({ pixelRatio: pR });
  downloadURI(dataURL, 'stage.png');

});


/** --------------------------------------------------------------
 * See: https://konvajs.org/docs/data_and_serialization/High-Quality-Export.html
 * function from https://stackoverflow.com/a/15832662/512042
 * --------------------------------------------------------------- */
function downloadURI(uri, name) {
  var link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


/** --------------------------------------------------------------
 * Given a width and height in pixels, calculate pixelRatio
 * and predict output width, height and ratio
 * ---------------------------------------------------------------
 * @param {Number} stageWidth Width in pixels of stage
 * @param {Number} stageHeight Height in pixels of stage
 * @returns Properties of output PNG
 */

function getOutputProperties (stageWidth, stageHeight) {

  /**
   * (stageWidth * x) = 4500
   * x = approximate pixelRatio
   */

  // Since we know it's 3:4, we only need the ratio between target output 4500 and the stage's width
  var pixelRatioW = (4500 / stageWidth);
  var pixelRatioH = (6000 / stageHeight);

  var pixelRatio = Math.min(pixelRatioW, pixelRatioH); // Grab the lesser of the two


  // Output PNG will be this size
  var outputWidth = (stageWidth * pixelRatio);
  var outputHeight = (stageHeight * pixelRatio);

  // What's the ratio? (should always be 3:4)
  var ratio = calculateRatio(outputWidth, outputHeight);

  var props = {
    pixelRatio: pixelRatio,
    outputWidth: outputWidth,
    outputHeight: outputHeight,
    ratio:ratio
  }

  return props


}

/** --------------------------------------------------------------
 * Calculate the ratio between two numbers
 *  --------------------------------------------------------------
 *  https://www.codespeedy.com/get-the-ratio-of-two-numbers-in-javascript/
 */

function calculateRatio(num_1, num_2){
  for(num=num_2; num>1; num--) {
      if((num_1 % num) == 0 && (num_2 % num) == 0) {
          num_1=num_1/num;
          num_2=num_2/num;
      }
  }
  var ratio = num_1+":"+num_2;
  return ratio;
}