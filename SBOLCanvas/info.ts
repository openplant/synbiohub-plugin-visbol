import { environment } from './environment.js'

/**
 * Base class for GlyphInfo InteractionInfo and ModuleInfo
 */
export abstract class Info {
  uriPrefix: string = environment.baseURI
  displayID: any

  abstract makeCopy(): Info
  abstract copyDataFrom(info: Info)
  abstract encode(enc: any)
  abstract getFullURI(): string
}
