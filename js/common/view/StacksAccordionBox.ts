// Copyright 2014-2023, University of Colorado Boulder

/**
 *  Accordion box that shows stacks of substances. Used in the 'Sandwiches' and 'Molecules' screens.
 *
 *  @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';
import RPALColors from '../RPALColors.js';
import StackNode from './StackNode.js';
import Substance from '../model/Substance.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';

// constants
const MAX_TITLE_PERCENTAGE = 0.75; // title will be scaled down if greater than this percentage of the box width
const TITLE_OPTIONS = { font: new PhetFont( 14 ), fill: 'white' }; // box titles
const DEFAULT_CONTENT_SIZE = new Dimension2( 100, 100 );
const DEFAULT_MIN_ICON_SIZE = new Dimension2( 0, 0 );

type SelfOptions = {
  contentSize?: Dimension2; // size of box's content
  minIconSize?: Dimension2; // minimum amount of layout space reserved for Substance icons
  maxQuantity?: number; // max substances in a stack
  boxYMargin?: number; // vertical margin between the inner edge of box and the tallest node
};

type StacksAccordionBoxOptions = SelfOptions;

export default class StacksAccordionBox extends AccordionBox {

  private readonly disposeStacksAccordionBox: () => void;

  /**
   * @param substances - substances in the box
   * @param xOffsets - x-offsets of each substance, in the same order as substances param
   * @param titleStringProperty
   * @param expandedProperty
   * @param [providedOptions]
   */
  public constructor( substances: Substance[],
                      xOffsets: number[],
                      titleStringProperty: TReadOnlyProperty<string>,
                      expandedProperty: Property<boolean>,
                      providedOptions?: StacksAccordionBoxOptions ) {

    assert && assert( substances.length > 0 );
    assert && assert( substances.length === xOffsets.length );

    const options = optionize<StacksAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {

      // SelfOptions
      contentSize: DEFAULT_CONTENT_SIZE,
      minIconSize: DEFAULT_MIN_ICON_SIZE,
      maxQuantity: 2,
      boxYMargin: 6,

      // AccordionBoxOptions
      fill: RPALColors.BOX_FILL,
      stroke: RPALColors.BOX_STROKE,
      cornerRadius: 3,
      expandedProperty: expandedProperty,
      expandCollapseButtonOptions: {
        touchAreaXDilation: 10,
        touchAreaYDilation: 10
      },
      titleNode: new Text( titleStringProperty, TITLE_OPTIONS ),
      titleBarOptions: {
        fill: RPALColors.PANEL_FILL
      },
      titleAlignX: 'center',
      buttonAlign: 'right',
      contentXMargin: 0,
      contentYMargin: 0,
      contentYSpacing: 0
    }, providedOptions );

    assert && assert( Number.isInteger( options.maxQuantity ) && options.maxQuantity > 0 );

    // scale the title to fit
    options.titleNode.setScaleMagnitude( Math.min( 1, MAX_TITLE_PERCENTAGE * options.contentSize.width / options.titleNode.width ) );

    // content for the accordion box
    const content = new Node();

    // rectangle with no fill, this ensures constant size of the content
    const rectangle = new Rectangle( 0, 0, options.contentSize.width, options.contentSize.height, options.cornerRadius, options.cornerRadius );
    content.addChild( rectangle );

    // compute max height of the nodes in the box
    const maxIconHeight = Math.max(
      options.minIconSize.height,
      _.maxBy( substances, substance => substance.iconProperty.value.height )!.iconProperty.value.height );

    // vertical stacks of nodes inside the box
    const stackNodes: StackNode[] = [];
    const deltaY = ( options.contentSize.height - ( 2 * options.boxYMargin ) - maxIconHeight ) / ( options.maxQuantity - 1 );
    const startCenterY = rectangle.height - options.boxYMargin - ( maxIconHeight / 2 );
    for ( let i = 0; i < substances.length; i++ ) {
      const substance = substances[ i ];
      const stackNode = new StackNode( options.contentSize.height, substance.iconProperty, substance.quantityProperty, startCenterY, deltaY, {
        centerX: xOffsets[ i ]
      } );
      content.addChild( stackNode );
      stackNodes.push( stackNode );
    }

    super( content, options );

    this.disposeStacksAccordionBox = () => {
      stackNodes.forEach( node => node.dispose() );
      stackNodes.length = 0;
    };
  }

  public override dispose(): void {
    this.disposeStacksAccordionBox();
    super.dispose();
  }
}

reactantsProductsAndLeftovers.register( 'StacksAccordionBox', StacksAccordionBox );