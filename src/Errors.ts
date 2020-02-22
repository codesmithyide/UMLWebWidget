/*
    Copyright (c) 2020 Xavier Leclercq
    Released under the MIT License
    See https://github.com/CodeSmithyIDE/UMLWebWidget/blob/master/LICENSE.txt
*/

'use strict'

/**
  Errors related to diagram operations are
  communicated via this class.

  Note that by default errors are only shown
  if debug mode is enabled in the {@link Settings}.
*/
class UMLWebWidgetError extends Error {    
}

export { UMLWebWidgetError }
