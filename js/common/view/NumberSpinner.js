// Copyright 2002-2014, University of Colorado Boulder

/**
 * Spinner for integer values, similar in 'look' to Java's JSpinner.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var TOUCH_DILATED_X = 20;
  var TOUCH_DILATED_Y = 10;

  /**
   * @param {Property.<number>} valueProperty value, must be an integer
   * @param {Range} range range of values, min and max must be integers
   * @param {Object} [options]
   * @constructor
   */
  function NumberSpinner( valueProperty, range, options ) {

    assert && assert( Util.isInteger( valueProperty.get() ) ); // value is an integer
    assert && assert( Util.isInteger( range.min ) && Util.isInteger( range.max ) ); // range is integer
    assert && assert( range.contains( valueProperty.get() ) ); // value is in range

    options = _.extend( {
      decimalPlaces: 0,
      font: new RPALFont( 28 ),
      xMargin: 5,
      yMargin: 3,
      ySpacing: 5
    }, options );

    var thisSpinner = this;

    var valueOptions = {
      font: options.font,
      fill: 'black'
    };

    // compute max width
    var maxWidth = Math.max(
      new Text( Util.toFixed( range.max, options.decimalPlaces ), valueOptions ).width,
      new Text( Util.toFixed( range.min, options.decimalPlaces ), valueOptions ).width
    );
    
    // value
    var valueNode = new Text( valueProperty.get(), valueOptions );
    var backgroundNode = new Rectangle( 0, 0, maxWidth + ( 2 * options.xMargin ), valueNode.height + ( 2 * options.yMargin ), 5, 5, {
      fill: 'white',
      stroke: 'black',
      lineWidth: 0.5
    });
    var valueParent = new Node( { children: [ backgroundNode, valueNode ] } );
    
    // buttons
    var upButton = new ArrowButton( 'up', function() { valueProperty.set( valueProperty.get() + 1 ); } );
    var downButton = new ArrowButton( 'down', function() { valueProperty.set( valueProperty.get() - 1 ); } );
    var buttonsParent = new VBox( { children: [ upButton, downButton ], spacing: options.ySpacing } );
    buttonsParent.setScaleMagnitude( backgroundNode.height / buttonsParent.height );
    upButton.touchArea = upButton.localBounds.dilatedXY( TOUCH_DILATED_X, TOUCH_DILATED_Y ).shiftedY( -TOUCH_DILATED_Y );
    downButton.touchArea = downButton.localBounds.dilatedXY( TOUCH_DILATED_X, TOUCH_DILATED_Y ).shiftedY( TOUCH_DILATED_Y );

    // buttons to right of value
    options.children = [ valueParent, buttonsParent ];
    options.spacing = options.ySpacing;
    HBox.call( thisSpinner, options );

    // When the value changes ...
    var valuePropertyObserver = function( value ) {
      assert && assert( range.contains( value ) );

      // update the text and center it
      valueNode.text = Util.toFixed( value, options.decimalPlaces );
      valueNode.center = backgroundNode.center;

      // enable/disable arrow buttons
      upButton.enabled = ( value < range.max );
      downButton.enabled = ( value > range.min );
    };
    valueProperty.link( valuePropertyObserver );

    // @public Unlinks from the value property. The spinner is no longer functional after calling this function.
    thisSpinner.dispose = function() {
      valueProperty.unlink( valuePropertyObserver );
    };
  }

  return inherit( HBox, NumberSpinner );
} );