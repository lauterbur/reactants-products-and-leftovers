// Copyright 2014-2020, University of Colorado Boulder

/**
 * 'Molecules' screen
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const H2ONode = require( 'NITROGLYCERIN/nodes/H2ONode' );
  const merge = require( 'PHET_CORE/merge' );
  const MoleculesModel = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/model/MoleculesModel' );
  const MoleculesScreenView = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/molecules/view/MoleculesScreenView' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const reactantsProductsAndLeftovers = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/reactantsProductsAndLeftovers' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RPALColors = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/RPALColors' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenMoleculesString = require( 'string!REACTANTS_PRODUCTS_AND_LEFTOVERS/screen.molecules' );

  // a11y strings
  const screenMoleculesDescriptionString = 'Investigate molecules';

  class MoleculesScreen extends Screen {

    constructor() {

      const options = {
        name: screenMoleculesString,
        backgroundColorProperty: new Property( RPALColors.SCREEN_BACKGROUND ),
        homeScreenIcon: createIcon( { moleculeLineWidth: 0.1 } ),
        navigationBarIcon: createIcon( { moleculeLineWidth: 0.5 } ),
        descriptionContent: screenMoleculesDescriptionString
      };

      super(
        () => new MoleculesModel(),
        model => new MoleculesScreenView( model ),
        options
      );
    }
  }

  /**
   * Creates the icon for this screen, an H2O molecule.
   * @param {Object} [options]
   * @returns {Node}
   */
  function createIcon( options ) {

    options = merge( {
      moleculeLineWidth: 1 // lineWidth used to stroke the molecule icon
    }, options );

    // background rectangle
    const width = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.width;
    const height = Screen.MINIMUM_HOME_SCREEN_ICON_SIZE.height;
    const background = new Rectangle( 0, 0, width, height, { fill: 'white' } );

    // H2O molecule, scaled to fit and centered on background
    const moleculeNode = new H2ONode( { atomOptions: { stroke: 'black', lineWidth: options.moleculeLineWidth } } );
    moleculeNode.setScaleMagnitude(
      Math.min( 0.82 * background.width / moleculeNode.width, 0.82 * background.height / moleculeNode.height ) );
    moleculeNode.center = background.center;

    return new Node( { children: [ background, moleculeNode ] } );
  }

  return reactantsProductsAndLeftovers.register( 'MoleculesScreen', MoleculesScreen );
} );