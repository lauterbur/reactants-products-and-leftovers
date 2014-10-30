// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bracket with a text label centered below it.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {SCENERY.Node} labelNode node that is used to label the bracket
   * @param {Object} [options]
   * @constructor
   */
  function HBracketNode( labelNode, options ) {

    options = _.extend( {
      bracketWidth: 100,
      bracketEndHeight: 5,
      bracketCurveXOffset: 5,
      bracketTipWidth: 6,
      bracketTipHeight: 6,
      bracketColor: 'black',
      ySpacing: 2
    }, options );

    // bracket, create shape left-to-right (curved ends, tip points down)
    var bracketShape = new Shape()
      .moveTo( 0, 0 )
      .quadraticCurveTo( 0, options.bracketEndHeight, options.bracketCurveXOffset, options.bracketEndHeight )
      .lineTo( ( options.bracketWidth - options.bracketTipWidth ) / 2, options.bracketEndHeight )
      .lineTo( ( options.bracketWidth / 2 ), ( options.bracketEndHeight + options.bracketTipHeight ) )
      .lineTo( ( options.bracketWidth + options.bracketTipWidth ) / 2, options.bracketEndHeight )
      .lineTo( options.bracketWidth - options.bracketCurveXOffset, options.bracketEndHeight )
      .quadraticCurveTo( options.bracketWidth, options.bracketEndHeight, options.bracketWidth, 0 );
    var bracketNode = new Path( bracketShape, {
      stroke: options.bracketColor
    } );

    // label, centered below bracket
    labelNode.centerX = bracketNode.centerX;
    labelNode.top = bracketNode.bottom + options.ySpacing;

    options.children = [ bracketNode, labelNode ];
    Node.call( this, options );
  }

  return inherit( Node, HBracketNode );
} );