// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays the equation for a custom sandwich.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Property = require( 'AXON/Property' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );

  // constants
  var COEFFICIENT_X_SPACING = 10;
  var PLUS_X_SPACING = 20;
  var ARROW_X_SPACING = 20;
  var TEXT_OPTIONS = { font: new RPALFont( 28 ), fill: 'white' };
  var PLUS_OPTIONS = { fill: 'white' };
  var ARROW_OPTIONS = { fill: 'white', stroke: null, scale: 0.65 };
  var PICKER_OPTIONS = { font: new RPALFont( 28 ), color: 'yellow', xMargin: 6, cornerRadius: 3 };
  var COEFFICIENT_RANGE_PROPERTY = new Property( RPALConstants.COEFFICIENT_RANGE );

  /**
   * Creates terms for equation.
   * @param {Substance[]} terms the terms to be added
   * @returns {Node}
   */
  var createTermsNode = function( terms ) {

    var parentNode = new Node();
    var numberOfTerms = terms.length;
    var coefficientNode, moleculeNode, plusNode; // hoist loop vars explicitly

    for ( var i = 0; i < numberOfTerms; i++ ) {

      // coefficient
      coefficientNode = new NumberPicker( terms[i].coefficientProperty, COEFFICIENT_RANGE_PROPERTY, PICKER_OPTIONS );
      coefficientNode.left = plusNode ? ( plusNode.right + PLUS_X_SPACING ) : 0;
      parentNode.addChild( coefficientNode );

      // molecule
      moleculeNode = new Node( { children: [ terms[i].molecule.node ] } );
      moleculeNode.left = coefficientNode.right + COEFFICIENT_X_SPACING;
      moleculeNode.centerY = coefficientNode.centerY;
      parentNode.addChild( moleculeNode );

      // plus sign between terms
      if ( i < numberOfTerms - 1 ) {
        plusNode = new PlusNode( PLUS_OPTIONS );
        plusNode.left = moleculeNode.right + PLUS_X_SPACING;
        plusNode.centerY = coefficientNode.centerY;
        parentNode.addChild( plusNode );
      }
      else {
        plusNode = null;
      }
    }

    return parentNode;
  };

  /**
   * @param {Reaction} reaction
   * @param {Object} [options]
   * @constructor
   */
  function CustomSandwichEquationNode( reaction, options ) {

    options = options || {};

    // left-hand side of the formula (reactants)
    var reactantsNode = createTermsNode( reaction.reactants );

    // right arrow
    var arrowNode = new RightArrowNode( ARROW_OPTIONS );
    arrowNode.left = reactantsNode.right + ARROW_X_SPACING;
    var coefficientHeight = new Text( '1', TEXT_OPTIONS ).height;
    arrowNode.centerY = reactantsNode.centerY;

    // right-hand side of the formula (products)
    var productsNode = createTermsNode( reaction.products );
    productsNode.left = arrowNode.right + ARROW_X_SPACING;
    productsNode.centerY = arrowNode.centerY;

    options.children = [ reactantsNode, arrowNode, productsNode ];
    Node.call( this, options );
  }

  return inherit( Node, CustomSandwichEquationNode );
} );