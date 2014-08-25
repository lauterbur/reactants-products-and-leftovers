// Copyright 2002-2014, University of Colorado Boulder

/**
 * Horizontal bar that contains a control for selecting a reaction,
 * and displays the formula for the reaction.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var EquationNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/EquationNode' );
  var ReactionChoiceNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/ReactionChoiceNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  // constants
  var X_MARGIN = 20;
  var Y_MARGIN = 10;

  /**
   * @param {Property<Reaction>} reactionProperty
   * @param {[Reaction]} reactions
   * @param {number} screenWidth width of the screen's safe area
   * @param {*} options
   * @constructor
   */
  function ReactionBarNode( reactionProperty, reactions, screenWidth, options ) {

    options = options || {};

    // control for choosing a reaction
    var reactionChoiceNode = new ReactionChoiceNode( reactionProperty, reactions );

    // background, extra wide so that it will appear to fill the screen width for all but extreme window sizes
    var backgroundNode = new Rectangle( 0, 0, 4 * screenWidth, reactionChoiceNode.height + ( 2 * Y_MARGIN ),
      { fill: '#3376c4', centerX: screenWidth / 2 } );

    // control at right, vertically centered
    reactionChoiceNode.right = screenWidth - X_MARGIN;
    reactionChoiceNode.centerY = backgroundNode.centerY;

    // parent for equation
    var equationParent = new Node();

    options.children = [ backgroundNode, equationParent, reactionChoiceNode ];
    Node.call( this, options );

    reactionProperty.link( function( reaction ) {

      // create the new equation node
      equationParent.removeAllChildren();
      equationParent.addChild( new EquationNode( reactionProperty.get() ) );
      equationParent.setScaleMagnitude( 1 );

      // scale the equation if it's too wide to fit the available space
      var availableWidth = reactionChoiceNode.left - ( 2 * X_MARGIN );
      var scale = Math.min( 1, availableWidth / equationParent.width );
      equationParent.setScaleMagnitude( scale );

      // center the equation in the space to the left of the controls
      equationParent.centerX = X_MARGIN + ( availableWidth / 2 );
      equationParent.centerY = backgroundNode.centerY;
    } );
  }

  return inherit( Node, ReactionBarNode );
} );