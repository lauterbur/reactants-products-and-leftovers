// Copyright 2014-2023, University of Colorado Boulder

/**
 * Box that is placed over things that are 'hidden' while playing a challenge.
 * Has a dashed border and a 'closed eye' icon in the center of the box.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import { Node, NodeOptions, NodeTranslationOptions, Path, Rectangle } from '../../../../scenery/js/imports.js';
import eyeSlashSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSlashSolidShape.js';
import reactantsProductsAndLeftovers from '../../reactantsProductsAndLeftovers.js';

const DEFAULT_BOX_SIZE = new Dimension2( 100, 100 );

type SelfOptions = {
  boxSize?: Dimension2;
  iconHeight?: number;
  cornerRadius?: number;
};

type HideBoxOptions = SelfOptions & NodeTranslationOptions;

export default class HideBox extends Node {

  public constructor( providedOptions?: HideBoxOptions ) {

    const options = optionize<HideBoxOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      boxSize: DEFAULT_BOX_SIZE,
      iconHeight: 35,
      cornerRadius: 0
    }, providedOptions );

    // dashed box
    const rectangleNode = new Rectangle( 0, 0, options.boxSize.width, options.boxSize.height, options.cornerRadius, options.cornerRadius, {
      fill: 'white',
      stroke: 'rgb(180,180,180)',
      lineDash: [ 14, 14 ]
    } );

    // closed-eye icon
    const eyeNode = new Path( eyeSlashSolidShape, {
      fill: 'rgb( 180, 180, 180 )'
    } );
    eyeNode.setScaleMagnitude( options.iconHeight / eyeNode.height );
    eyeNode.center = rectangleNode.center;

    options.children = [ rectangleNode, eyeNode ];
    super( options );
  }
}

reactantsProductsAndLeftovers.register( 'HideBox', HideBox );