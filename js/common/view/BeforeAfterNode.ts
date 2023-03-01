// Copyright 2014-2023, University of Colorado Boulder

// @ts-nocheck
/**
 * This is the primary UI component for the 'Sandwiches' and 'Molecules' screens.
 * It displays a reaction as 2 boxes, representing the 'Before' and 'After' states of the reaction.
 * The 'Before' box is on the left, and shows the initial reactants.
 * The 'After' box is on the right, and shows the products and leftovers when the reaction has completed.
 * Below the 'Before' box is a set of spinners for changing the reactant quantities.
 * Below the 'After' box is a set of noneditable quantities for products and leftovers.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import { HBox, Node } from '../../../../scenery/js/imports.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import RPALColors from '../RPALColors.js';
import RPALConstants from '../RPALConstants.js';
import QuantitiesNode from './QuantitiesNode.js';
import RightArrowNode from './RightArrowNode.js';
import StacksAccordionBox from './StacksAccordionBox.js';

export default class BeforeAfterNode extends Node {

  /**
   * @param {Reaction} reaction the reaction to be displayed
   * @param {Property.<boolean>} beforeExpandedProperty whether the 'Before' box is expanded
   * @param {Property.<boolean>} afterExpandedProperty whether the 'After' box is expanded
   * @param {Object} [options]
   */
  constructor( reaction, beforeExpandedProperty, afterExpandedProperty, options ) {

    options = merge( {
      contentSize: new Dimension2( 100, 100 ), // {Dimension2} size of the 'Before' and 'After' boxes
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of the quantity values
      showSymbols: true, // {boolean} whether to show symbols (eg, H2O) for the substances in the reactions
      beforeTitleProperty: ReactantsProductsAndLeftoversStrings.beforeReactionStringProperty,  // {string} title on the 'Before' box
      afterTitleProperty: ReactantsProductsAndLeftoversStrings.afterReactionStringProperty, // {string} title on the 'After' box
      boxYMargin: 6, // {number} vertical margin between the inner edge of box and the tallest node
      minIconSize: new Dimension2( 0, 0 ) // {Dimension2} minimum amount of layout space reserved for Substance icons
    }, options );

    super();

    // vars to improve readability
    const reactants = reaction.reactants;
    const products = reaction.products;
    const leftovers = reaction.leftovers;

    // x-offsets of the substances relative to their boxes
    const beforeXOffsets = QuantitiesNode.createXOffsets( reactants.length, options.contentSize.width );
    const afterXOffsets = QuantitiesNode.createXOffsets( products.length + leftovers.length, options.contentSize.width );

    const stacksAccordionBoxOptions = {
      contentSize: options.contentSize,
      iconSize: options.iconSize,
      maxQuantity: options.quantityRange.max,
      boxYMargin: options.boxYMargin
    };

    // @private 'Before Reaction' box, with stacks of reactants
    this.beforeBox = new StacksAccordionBox( reactants, beforeXOffsets, options.beforeTitleProperty,
      beforeExpandedProperty, stacksAccordionBoxOptions );

    // @private 'After Reaction' box, with stacks of products and leftovers
    this.afterBox = new StacksAccordionBox( products.concat( leftovers ), afterXOffsets, options.afterTitleProperty,
      afterExpandedProperty, stacksAccordionBoxOptions );

    // Arrow between boxes
    const arrowNode = new RightArrowNode( { fill: RPALColors.PANEL_FILL, stroke: null, scale: 0.75 } );

    // layout of boxes and arrow
    const hBox = new HBox( {
      children: [ this.beforeBox, arrowNode, this.afterBox ],
      spacing: 10
    } );
    this.addChild( hBox );

    // @private Everything below the boxes
    this.quantitiesNode = new QuantitiesNode( reactants, products, leftovers, beforeXOffsets, afterXOffsets, {
      showSymbols: options.showSymbols,
      boxWidth: options.contentSize.width,
      afterBoxXOffset: this.afterBox.left - this.beforeBox.left,
      minIconSize: options.minIconSize,
      quantityRange: options.quantityRange,
      x: this.beforeBox.x,
      top: this.beforeBox.bottom + 6
    } );
    this.addChild( this.quantitiesNode );

    // pass options to supertype
    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {

    // accordion boxes
    this.beforeBox.dispose();
    this.beforeBox = null;
    this.afterBox.dispose();
    this.afterBox = null;

    // stuff below the boxes
    this.quantitiesNode.dispose();
    this.quantitiesNode = null;

    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'BeforeAfterNode', BeforeAfterNode );