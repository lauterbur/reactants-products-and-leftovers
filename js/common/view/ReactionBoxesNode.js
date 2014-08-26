// Copyright 2002-2014, University of Colorado Boulder

/**
 * Displays a reaction as 2 boxes, representing the 'before' and 'after' states of the reaction.
 * The 'before' box is on the left, and shows the initial reactants.
 * The 'after' box is on the right, and shows the products and leftovers when the reaction has completed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBracketNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/HBracketNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntegerNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/IntegerNode' );
  var IntegerSpinner = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/IntegerSpinner' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RPALConstants = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALConstants' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RightArrowNode = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RightArrowNode' );
  var RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );

  // strings
  var reactantsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/reactants' );
  var productsString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/products' );
  var leftoversString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/leftovers' );

  // constants
  var QUANTITY_FONT = new RPALFont( 28 );
  var SYMBOL_FONT = new RPALFont( 16 );
  var BOX_QUANTITY_SPACING = 6; // vertical space between box and quantity
  var QUANTITY_IMAGE_SPACING = 6; // vertical space between quantity and image
  var IMAGE_SYMBOL_SPACING = 2; // vertical space between image and symbol
  var BRACKET_X_MARGIN = 10; // amount that brackets extend beyond the things they bracket

  /**
   * @param {Reaction} reaction
   * @param {*} options
   * @constructor
   */
  function ReactionBoxesNode( reaction, options ) {

    options = _.extend( {
      boxSize: new Dimension2( 300, 250 ), // size of the 'before' and 'after' boxes
      xMargin: 10, // x-margin inside the boxes
      yMargin: 10,  // y-margin inside the boxes
      layoutStrategy: 'stacked', // layout strategy for molecules inside the boxes, either 'stacked' or 'random',
      showSymbols: true // whether to show the molecule symbols
    }, options );

    var thisNode = this;
    Node.call( thisNode );

    // boxes with arrow between them
    var boxOptions = { fill: 'white', stroke: 'black' };
    var beforeBox = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, boxOptions );
    var arrowNode = new RightArrowNode( { fill: RPALColors.REACTION_BAR_COLOR, stroke: null, scale: 0.75 } );
    var afterBox = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, boxOptions );
    var hBox = new HBox( { children: [ beforeBox, arrowNode, afterBox ], spacing: 10 } );
    thisNode.addChild( hBox );

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    var quantityNodes = [];
    var imageNodes = [];
    var symbolNodes = [];

    // compute the max height of quantity and image components, to aid in vertical alignment
    var maxQuantityHeight = 0;
    var maxImageHeight = 0;

    // explicitly hoist vars that are reused in loops
    var reactant, product, i, xMargin, centerX, deltaX, quantityNode, imageNode, symbolNode;

    // reactants
    var reactantsParent = new Node();
    thisNode.addChild( reactantsParent );
    var numberOfReactants = reaction.reactants.length;
    xMargin = ( numberOfReactants > 2 ) ? 0 : ( 0.15 * options.boxSize.width ); // make 2 reactants case look nice
    deltaX = ( options.boxSize.width - ( 2 * xMargin ) ) / numberOfReactants;
    centerX = beforeBox.left + xMargin + (deltaX / 2 );
    for ( i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // quantity is editable via a spinner
      quantityNode = new IntegerSpinner( reactant.quantityProperty, RPALConstants.QUANTITY_RANGE, { font: QUANTITY_FONT } );
      reactantsParent.addChild( quantityNode );
      quantityNodes.push( quantityNode );
      quantityNode.centerX = centerX;
      maxQuantityHeight = Math.max( maxQuantityHeight, quantityNode.height );

      // image
      imageNode = reactant.molecule.node;
      reactantsParent.addChild( imageNode );
      imageNodes.push( imageNode );
      imageNode.centerX = quantityNode.centerX;
      maxImageHeight = Math.max( maxImageHeight, imageNode.height );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.molecule.symbol, { font: SYMBOL_FONT } );
        reactantsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
        symbolNode.centerX = imageNode.centerX;
      }

      centerX += deltaX;
    }

    // products
    var productsParent = new Node();
    thisNode.addChild( productsParent );
    var numberOfProducts = reaction.products.length;
    xMargin = ( numberOfProducts + numberOfReactants > 2 ) ? 0 : ( 0.15 * options.boxSize.width ); // make 2 reactants case look nice
    deltaX = ( options.boxSize.width - ( 2 * xMargin ) ) / ( numberOfProducts + numberOfReactants );
    centerX = afterBox.left + xMargin + (deltaX / 2 );
    for ( i = 0; i < numberOfProducts; i++ ) {

      product = reaction.products[i];

      // quantity is not editable
      quantityNode = new IntegerNode( product.quantityProperty, { font: QUANTITY_FONT } );
      productsParent.addChild( quantityNode );
      quantityNodes.push( quantityNode );
      quantityNode.centerX = centerX;
      maxQuantityHeight = Math.max( maxQuantityHeight, quantityNode.height );

      // image
      imageNode = new Node( { children: [ product.molecule.node ] } );
      productsParent.addChild( imageNode );
      imageNodes.push( imageNode );
      imageNode.centerX = quantityNode.centerX;

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( product.molecule.symbol, { font: SYMBOL_FONT } );
        productsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
        symbolNode.centerX = imageNode.centerX;
      }

      centerX += deltaX;
    }

    // leftovers
    var leftoversParent = new Node();
    thisNode.addChild( leftoversParent );
    for ( i = 0; i < numberOfReactants; i++ ) {

      reactant = reaction.reactants[i];

      // quantity is not editable
      quantityNode = new IntegerNode( reactant.leftoversProperty, { font: QUANTITY_FONT } );
      leftoversParent.addChild( quantityNode );
      quantityNodes.push( quantityNode );
      quantityNode.centerX = centerX;
      maxQuantityHeight = Math.max( maxQuantityHeight, quantityNode.height );

      // image
      imageNode = new Node( { children: [ reactant.molecule.node ] } );
      leftoversParent.addChild( imageNode );
      imageNodes.push( imageNode );
      imageNode.centerX = quantityNode.centerX;
      maxImageHeight = Math.max( maxImageHeight, imageNode.height );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new SubSupText( reactant.molecule.symbol, { font: SYMBOL_FONT } );
        leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
        symbolNode.centerX = imageNode.centerX;
      }

      centerX += deltaX;
    }

    // vertical layout of components below the boxes
    for ( i = 0; i < quantityNodes.length; i++ ) {
      quantityNodes[i].centerY = beforeBox.bottom + BOX_QUANTITY_SPACING + ( maxQuantityHeight / 2 );
      imageNodes[i].centerY = quantityNodes[i].top + maxQuantityHeight + QUANTITY_IMAGE_SPACING + ( maxImageHeight / 2 );
      if ( options.showSymbols ) {
        symbolNodes[i].top = quantityNodes[i].top + maxQuantityHeight + QUANTITY_IMAGE_SPACING + maxImageHeight + IMAGE_SYMBOL_SPACING;
      }
    }

    // brackets
    var BRACKET_TOP = Math.max( reactantsParent.bottom, Math.max( productsParent.bottom, leftoversParent.bottom ) );
    var reactantsBracket = new HBracketNode( reactantsString, {
      bracketColor: RPALColors.REACTION_BAR_COLOR,
      bracketWidth: reactantsParent.width + ( 2 * BRACKET_X_MARGIN ),
      centerX: reactantsParent.centerX,
      top: BRACKET_TOP
    } );
    thisNode.addChild( reactantsBracket );

    var productsBracket = new HBracketNode( productsString, {
      bracketColor: RPALColors.REACTION_BAR_COLOR,
      bracketWidth: productsParent.width + ( 2 * BRACKET_X_MARGIN ),
      centerX: productsParent.centerX,
      top: BRACKET_TOP
    } );
    thisNode.addChild( productsBracket );

    var leftoversBracket = new HBracketNode( leftoversString, {
      bracketColor: RPALColors.REACTION_BAR_COLOR,
      bracketWidth: leftoversParent.width + ( 2 * BRACKET_X_MARGIN ),
      centerX: leftoversParent.centerX,
      top: BRACKET_TOP
    } );
    thisNode.addChild( leftoversBracket );

    // pass options to supertype
    thisNode.mutate( options );
  }

  return inherit( Node, ReactionBoxesNode );
} );