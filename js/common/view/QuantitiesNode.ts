// Copyright 2014-2023, University of Colorado Boulder

/**
 * The 'quantities' interface includes everything that's displayed below the Before/After boxes.
 * It indicates the quantities of reactants, products and leftovers, and allows interaction
 * with either the Before or After quantities.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import BracketNode from '../../../../scenery-phet/js/BracketNode.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, NodeOptions, NodeTranslationOptions, RichText, Text } from '../../../../scenery/js/imports.js';
import NumberSpinner, { NumberSpinnerOptions } from '../../../../sun/js/NumberSpinner.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import ReactantsProductsAndLeftoversStrings from '../../ReactantsProductsAndLeftoversStrings.js';
import BoxType from '../model/BoxType.js';
import Substance from '../model/Substance.js';
import RPALColors from '../RPALColors.js';
import RPALConstants from '../RPALConstants.js';
import HideBox from './HideBox.js';
import NumberNode from './NumberNode.js';
import SubstanceIcon from './SubstanceIcon.js';

// constants
const QUANTITY_FONT = new PhetFont( 28 ); // font for the quantities that appear below the boxes
const SYMBOL_FONT = new PhetFont( 16 ); // font for the symbols that appear below the boxes
const QUANTITY_IMAGE_Y_SPACING = 4; // vertical space between quantity and image
const IMAGE_SYMBOL_Y_SPACING = 2; // vertical space between image and symbol
const BRACKET_Y_SPACING = 1; // vertical space between the brackets and whatever is directly above it
const BRACKET_X_MARGIN = 6; // amount that brackets extend beyond the things they bracket
const BRACKET_LABEL_OPTIONS = {
  font: new PhetFont( 12 ),
  fill: 'black',
  maxWidth: 140 // maximum width of bracket labels, determined empirically
};
const NUMBER_SPINNER_OPTIONS = RPALConstants.NUMBER_SPINNER_OPTIONS;

type SelfOptions = {
  interactiveBox?: BoxType; // which box is interactive (Before or After)
  boxWidth?: number; // width of the Before and After boxes
  afterBoxXOffset?: number; // x-offset of left of After box, relative to left of Before box
  quantityRange?: Range; // range of spinners
  hideNumbersBox?: boolean; // {boolean} should we include a 'hide box' to cover the static numbers?
  minIconSize?: Dimension2; // minimum amount of layout space reserved for Substance icons
  showSymbols?: boolean; // whether to show symbols (eg, H2O) for the substances in the reactions
};

type QuantitiesNodeOptions = SelfOptions & NodeTranslationOptions;

export default class QuantitiesNode extends Node {

  private readonly reactants: Substance[];
  private readonly products: Substance[];
  private readonly leftovers: Substance[];
  private readonly interactiveBox: BoxType;
  private readonly spinnerNodes: NumberSpinner[];
  private readonly beforeNumberNodes: NumberNode[];
  private readonly afterNumberNodes: NumberNode[];
  private readonly reactantsParent: Node; // reactants, below the 'Before' box
  private readonly productsParent: Node; // products, below the 'After' box
  private readonly leftoversParent: Node; // leftovers, below the 'After' box, to the right of the products
  private readonly hideNumbersBox?: Node; // optional 'Hide numbers' box, to hide static quantities

  private readonly disposeQuantitiesNode: () => void;

  /**
   * @param reactants
   * @param products
   * @param leftovers
   * @param beforeXOffsets - offsets of reactants relative to the left edge of the 'Before' box
   * @param afterXOffsets - offsets of products and leftovers relative to the left edge of the 'Before' box
   * @param [providedOptions]
   */
  public constructor( reactants: Substance[], products: Substance[], leftovers: Substance[],
                      beforeXOffsets: number[], afterXOffsets: number[], providedOptions?: QuantitiesNodeOptions ) {

    assert && assert( reactants.length === beforeXOffsets.length );
    assert && assert( products.length + leftovers.length === afterXOffsets.length );

    const options = optionize<QuantitiesNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      interactiveBox: BoxType.BEFORE, // {BoxType} interactiveBox which box is interactive
      boxWidth: 100, // {number} width of the Before and After boxes
      afterBoxXOffset: 200, // {number} x-offset of left of After box, relative to left of Before box
      quantityRange: RPALConstants.QUANTITY_RANGE, // {Range} range of spinners
      hideNumbersBox: false,  // {boolean} should we include a 'hide box' to cover the static numbers?
      minIconSize: new Dimension2( 0, 0 ), // minimum amount of layout space reserved for Substance icons
      showSymbols: true // {boolean} whether to show symbols (eg, H2O) for the substances in the reactions
    }, providedOptions );

    // explicitly hoist reused vars
    let i;
    let reactant;
    let product;
    let leftover;
    let centerX;
    let numberNode;
    let spinnerNode;
    let iconNode;
    let symbolNode;

    // keep track of components that appear below the boxes, so we can handle their vertical alignment
    const spinnerNodes: NumberSpinner[] = [];
    const beforeNumberNodes: NumberNode[] = [];
    const afterNumberNodes: NumberNode[] = [];

    const iconNodes: Node[] = [];
    const symbolNodes: Node[] = [];

    // reactants, below the 'Before' box
    const reactantsParent = new Node();
    for ( i = 0; i < reactants.length; i++ ) {

      reactant = reactants[ i ];
      centerX = beforeXOffsets[ i ];

      if ( options.interactiveBox === BoxType.BEFORE ) {
        // spinner
        spinnerNode = new NumberSpinner( reactant.quantityProperty, new Property( options.quantityRange ),
          combineOptions<NumberSpinnerOptions>( {}, NUMBER_SPINNER_OPTIONS, { centerX: centerX } ) );
        reactantsParent.addChild( spinnerNode );
        spinnerNodes.push( spinnerNode );
      }
      else {
        // static number
        numberNode = new NumberNode( reactant.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
        reactantsParent.addChild( numberNode );
        beforeNumberNodes.push( numberNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( reactant.iconProperty, { centerX: centerX } );
      reactantsParent.addChild( iconNode );
      iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new RichText( reactant.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        reactantsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    // products, below the 'After' box
    const productsParent = new Node();
    for ( i = 0; i < products.length; i++ ) {

      product = products[ i ];
      centerX = options.afterBoxXOffset + afterXOffsets[ i ];

      if ( options.interactiveBox === BoxType.AFTER ) {
        // spinner
        spinnerNode = new NumberSpinner( product.quantityProperty, new Property( options.quantityRange ),
          combineOptions<NumberSpinnerOptions>( {}, NUMBER_SPINNER_OPTIONS, { centerX: centerX } ) );
        productsParent.addChild( spinnerNode );
        spinnerNodes.push( spinnerNode );
      }
      else {
        // static number
        numberNode = new NumberNode( product.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
        productsParent.addChild( numberNode );
        afterNumberNodes.push( numberNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( product.iconProperty, { centerX: centerX } );
      productsParent.addChild( iconNode );
      iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new RichText( product.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        productsParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    // leftovers, below the 'After' box, to the right of the products
    const leftoversParent = new Node();
    for ( i = 0; i < leftovers.length; i++ ) {

      leftover = leftovers[ i ];
      centerX = options.afterBoxXOffset + afterXOffsets[ i + products.length ]; // leftovers follow products in afterXOffsets

      if ( options.interactiveBox === BoxType.AFTER ) {
        // spinner
        spinnerNode = new NumberSpinner( leftover.quantityProperty, new Property( options.quantityRange ),
          combineOptions<NumberSpinnerOptions>( {}, NUMBER_SPINNER_OPTIONS, { centerX: centerX } ) );
        leftoversParent.addChild( spinnerNode );
        spinnerNodes.push( spinnerNode );
      }
      else {
        // static number
        numberNode = new NumberNode( leftover.quantityProperty, { font: QUANTITY_FONT, centerX: centerX } );
        leftoversParent.addChild( numberNode );
        afterNumberNodes.push( numberNode );
      }

      // substance icon
      iconNode = new SubstanceIcon( leftover.iconProperty, { centerX: centerX } );
      leftoversParent.addChild( iconNode );
      iconNodes.push( iconNode );

      // symbol
      if ( options.showSymbols ) {
        symbolNode = new RichText( leftover.symbol, { font: SYMBOL_FONT, centerX: centerX } );
        leftoversParent.addChild( symbolNode );
        symbolNodes.push( symbolNode );
      }
    }

    /*
     * Vertical layout of components below the boxes.
     * Ensures that all similar components (spinners, numbers, icons, symbols) are vertically centered.
     */
    const spinnerHeight = spinnerNodes[ 0 ].height;
    const maxIconHeight = Math.max( options.minIconSize.height, _.maxBy( iconNodes, node => node.height )!.height );
    const maxSymbolHeight = symbolNodes.length ? _.maxBy( symbolNodes, node => node.height )!.height : 0;

    spinnerNodes.forEach( spinnerNode => {
      spinnerNode.centerY = ( spinnerHeight / 2 );
    } );
    beforeNumberNodes.forEach( numberNode => {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    afterNumberNodes.forEach( numberNode => {
      numberNode.centerY = ( spinnerHeight / 2 );
    } );
    iconNodes.forEach( iconNode => {
      iconNode.centerY = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + ( maxIconHeight / 2 );
    } );
    if ( options.showSymbols ) {
      symbolNodes.forEach( symbolNode => {
        symbolNode.top = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxIconHeight + IMAGE_SYMBOL_Y_SPACING;
      } );
    }

    // top of brackets is relative to the bottom of the stuff above
    let bracketsTop = spinnerHeight + QUANTITY_IMAGE_Y_SPACING + maxIconHeight + BRACKET_Y_SPACING;
    if ( options.showSymbols ) {
      bracketsTop += ( maxSymbolHeight + IMAGE_SYMBOL_Y_SPACING );
    }

    // 'Reactants' bracket
    const reactantsLabel = new Text( ReactantsProductsAndLeftoversStrings.reactantsStringProperty, BRACKET_LABEL_OPTIONS );
    const reactantsBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: reactantsLabel,
      bracketLength: Math.max( options.minIconSize.width, reactantsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: reactantsParent.centerX,
      top: bracketsTop
    } );

    // 'Products' bracket
    const productsLabel = new Text( ReactantsProductsAndLeftoversStrings.productsStringProperty, BRACKET_LABEL_OPTIONS );
    const productsBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: productsLabel,
      bracketLength: Math.max( options.minIconSize.width, productsParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: productsParent.centerX,
      top: bracketsTop
    } );

    // 'Leftovers' bracket
    const leftoversLabel = new Text( ReactantsProductsAndLeftoversStrings.leftoversStringProperty, BRACKET_LABEL_OPTIONS );
    const leftoversBracket = new BracketNode( {
      bracketStroke: RPALColors.PANEL_FILL,
      labelNode: leftoversLabel,
      bracketLength: Math.max( options.minIconSize.width, leftoversParent.width + ( 2 * BRACKET_X_MARGIN ) ),
      centerX: leftoversParent.centerX,
      top: bracketsTop
    } );

    options.children = [
      reactantsParent, productsParent, leftoversParent,
      reactantsBracket, productsBracket, leftoversBracket
    ];

    // Optional 'Hide numbers' box on top of the static quantities
    let hideNumbersBox;
    if ( options.hideNumbersBox ) {
      hideNumbersBox = new HideBox( {
        boxSize: new Dimension2( options.boxWidth, spinnerHeight ),
        iconHeight: 0.65 * spinnerHeight,
        cornerRadius: 3,
        left: ( options.interactiveBox === BoxType.BEFORE ) ? options.afterBoxXOffset : 0,
        centerY: spinnerNodes[ 0 ].centerY
      } );
      options.children.push( hideNumbersBox );
    }

    super( options );

    this.reactants = reactants;
    this.products = products;
    this.leftovers = leftovers;
    this.interactiveBox = options.interactiveBox;
    this.spinnerNodes = spinnerNodes;
    this.beforeNumberNodes = beforeNumberNodes;
    this.afterNumberNodes = afterNumberNodes;
    this.reactantsParent = reactantsParent;
    this.productsParent = productsParent;
    this.leftoversParent = leftoversParent;
    this.hideNumbersBox = hideNumbersBox;

    this.disposeQuantitiesNode = () => {
      this.spinnerNodes.forEach( node => node.dispose() );
      this.beforeNumberNodes.forEach( node => node.dispose() );
      this.afterNumberNodes.forEach( node => node.dispose() );
      iconNodes.forEach( node => node.dispose() );
    };
  }

  /**
   * Determines whether this UI component is interactive (true on creation).
   * When it's interactive, spinners are visible; when not, static numbers are visible.
   * Static numbers are created on demand, so that we don't have unnecessary nodes for situations
   * that are always interactive, and to improve performance on creation.
   */
  public setInteractive( interactive: boolean ): void {

    // spinners
    this.spinnerNodes.forEach( spinnerNode => { spinnerNode.visible = interactive; } );

    const centerY = this.spinnerNodes[ 0 ].height / 2;
    let i;
    let numberNode;
    let centerX; // explicitly hoist loop vars

    if ( this.interactiveBox === BoxType.BEFORE ) {

      // reactants, create static numbers on demand
      if ( !interactive && this.beforeNumberNodes.length === 0 ) {
        for ( i = 0; i < this.reactants.length; i++ ) {
          centerX = this.spinnerNodes[ i ].centerX;
          numberNode = new NumberNode( this.reactants[ i ].quantityProperty,
            { font: QUANTITY_FONT, centerX: centerX, centerY: centerY } );
          this.reactantsParent.addChild( numberNode );
          this.beforeNumberNodes.push( numberNode );
        }
      }

      // visibility
      if ( this.beforeNumberNodes.length > 0 ) {
        this.beforeNumberNodes.forEach( node => { node.visible = !interactive; } );
      }
    }
    else {

      // create static numbers on demand
      if ( !interactive && this.afterNumberNodes.length === 0 ) {

        // products
        for ( i = 0; i < this.products.length; i++ ) {
          centerX = this.spinnerNodes[ i ].centerX;
          numberNode = new NumberNode( this.products[ i ].quantityProperty,
            { font: QUANTITY_FONT, centerX: centerX, centerY: centerY } );
          this.productsParent.addChild( numberNode );
          this.afterNumberNodes.push( numberNode );
        }

        // leftovers
        for ( i = 0; i < this.leftovers.length; i++ ) {
          centerX = this.spinnerNodes[ i + this.products.length ].centerX; // leftover spinners follow product spinners
          numberNode = new NumberNode( this.leftovers[ i ].quantityProperty,
            { font: QUANTITY_FONT, centerX: centerX, centerY: centerY } );
          this.leftoversParent.addChild( numberNode );
          this.afterNumberNodes.push( numberNode );
        }
      }

      // visibility
      if ( this.afterNumberNodes.length > 0 ) {
        this.afterNumberNodes.forEach( node => { node.visible = !interactive; } );
      }
    }
  }

  /**
   * Changes visibility of the 'Hide numbers' box.
   */
  public setHideNumbersBoxVisible( visible: boolean ): void {
    if ( this.hideNumbersBox ) {
      this.hideNumbersBox.visible = visible;
    }
  }

  public override dispose(): void {
    this.disposeQuantitiesNode();
    super.dispose();
  }

  /**
   * Creates x-offsets for substances, relative to the left edge of their 'Before' or 'After' box.
   */
  public static createXOffsets( numberOfSubstances: number, boxWidth: number ): number[] {
    assert && assert( Number.isInteger( numberOfSubstances ) && numberOfSubstances > 0 );
    assert && assert( boxWidth > 0 );

    const xOffsets = [];
    const xMargin = ( numberOfSubstances > 2 ) ? 0 : ( 0.15 * boxWidth ); // make 2-reactant case look nice
    const deltaX = ( boxWidth - ( 2 * xMargin ) ) / numberOfSubstances;
    let xOffset = xMargin + ( deltaX / 2 );
    for ( let i = 0; i < numberOfSubstances; i++ ) {
      xOffsets.push( xOffset );
      xOffset += deltaX;
    }
    return xOffsets;
  }
}

reactantsProductsAndLeftovers.register( 'QuantitiesNode', QuantitiesNode );