// Copyright 2002-2014, University of Colorado Boulder

/**
 * Group of mutually-exclusive buttons that are used to advance a challenge through its states.
 * The buttons are 'Check', 'Try Again', 'Show Answer' and 'Next'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayState = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/game/model/PlayState' );
  var RPALFont = require( 'REACTANTS_PRODUCTS_AND_LEFTOVERS/common/view/RPALFont' );
  var TextPushButton = require( 'SUN/buttons/TextPushButton' );

  // strings
  var checkString = require( 'string!VEGAS/check' );
  var nextString = require( 'string!VEGAS/next' );
  var showAnswerString = require( 'string!VEGAS/showAnswer' );
  var tryAgainString = require( 'string!VEGAS/tryAgain' );

  // constants
  var BUTTON_OPTIONS = {
    font: new RPALFont( { size: 20, weight: 'bold' } ),
    baseColor: 'yellow',
    opacity: 0.75,
    xMargin: 20,
    yMargin: 5,
    centerX: 0 // so that all buttons are center aligned
  };

  /**
   * @param {GameModel} model
   * @param {Property.<boolean>} checkButtonEnabledProperty is the 'Check' button enabled?
   * @param {Object} [options]
   * @constructor
   */
  function GameButtons( model, checkButtonEnabledProperty, options ) {

    options = options || {};

    var checkButton = new TextPushButton( checkString, BUTTON_OPTIONS );
    var tryAgainButton = new TextPushButton( tryAgainString, BUTTON_OPTIONS );
    var showAnswerButton = new TextPushButton( showAnswerString, BUTTON_OPTIONS );
    var nextButton = new TextPushButton( nextString, BUTTON_OPTIONS );

    options.children = [ checkButton, tryAgainButton, showAnswerButton, nextButton ];

    var thisNode = this;
    Node.call( thisNode, options );

    // 'Check' button
    checkButton.addListener( function() {
      model.check();
    } );
    // no need to unlink from this property in dispose, it's lifetime is the same as this node
    checkButtonEnabledProperty.link( function( enabled ) {
      checkButton.enabled = enabled;
    } );

    // 'Try Again' button
    tryAgainButton.addListener( function() {
      model.tryAgain();
    } );

    // 'Show Answer' button
    showAnswerButton.addListener( function() {
      model.showAnswer();
    } );

    // 'Next' button
    nextButton.addListener( function() {
      model.next();
    } );

    // @private
    thisNode.playStateObserver = function( state ) {
      // make the proper button visible for the {PlayState} state
      checkButton.visible = ( state === PlayState.FIRST_CHECK || state === PlayState.SECOND_CHECK );
      tryAgainButton.visible = ( state === PlayState.TRY_AGAIN );
      showAnswerButton.visible = ( state === PlayState.SHOW_ANSWER );
      nextButton.visible = ( state === PlayState.NEXT );
    };
    thisNode.playStateProperty = model.playStateProperty; // @private see dispose
    thisNode.playStateProperty.link( this.playStateObserver );
  }

  return inherit( Node, GameButtons, {

    // Ensures that this node is eligible for GC.
    dispose: function() {
      this.playStateProperty.unlink( this.playStateObserver );
    }
  } );
} );
