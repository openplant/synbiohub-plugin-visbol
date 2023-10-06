'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.MetadataService = void 0
const rxjs_1 = require('rxjs')
const axios_observable_1 = __importDefault(require('axios-observable'))
const environment_js_1 = require('./environment.js')
const style_info_js_1 = require('./style-info.js')
class MetadataService {
  // TODO: DNA strand info
  //private http: HttpClient
  constructor() {
    /**
     * The metadata service can be a confusing object so here is some explanation:
     * Making a variable in the metadata service observable makes it available to
     * other objects asynchronously.
     *
     * The purpose of this is to allow changes to be made to a shared piece of information,
     * and for that information to be made available to whoever is interested without
     * blocking the entire application.
     *
     * In order for another object to use a variable in the metadata service, they need to
     * subscribe to it, and provide a method to handle the new data that was passed to
     * it.
     *
     * In order to track data that is being passed around, all data passed to the UI components
     * should be passed through here, even it is not asynchronous.
     */
    // Glyph Info
    //URLs
    this.typesURL = environment_js_1.environment.backendURL + '/data/types'
    this.rolesURL = environment_js_1.environment.backendURL + '/data/roles'
    this.refinementsURL = environment_js_1.environment.backendURL + '/data/refine'
    this.interactionsURL = environment_js_1.environment.backendURL + '/data/interactions'
    this.interactionRolesURL = environment_js_1.environment.backendURL + '/data/interactionRoles'
    this.interactionRoleRefinementURL =
      environment_js_1.environment.backendURL + '/data/interactionRoleRefine'
    // Glyph Info
    this.glyphInfoSource = new rxjs_1.BehaviorSubject(null)
    this.selectedGlyphInfo = this.glyphInfoSource.asObservable()
    // Interaction Info
    this.interactionInfoSource = new rxjs_1.BehaviorSubject(null)
    this.selectedInteractionInfo = this.interactionInfoSource.asObservable()
    // Module info
    this.moduleInfoSource = new rxjs_1.BehaviorSubject(null)
    this.selectedModuleInfo = this.moduleInfoSource.asObservable()
    // Combinatorial info
    this.combinatorialInfoSource = new rxjs_1.BehaviorSubject(null)
    this.selectedCombinatorialInfo = this.combinatorialInfoSource.asObservable()
    // Style Info
    this.styleInfoSource = new rxjs_1.BehaviorSubject(new style_info_js_1.StyleInfo([]))
    this.style = this.styleInfoSource.asObservable()
    // This boolean tells us if the application is zoomed into a component definition or single glyph
    // If this is true, the UI will disable some things like adding a new DNA strand, because a component
    // Definition cannot have multiple strands.
    this.componentDefinitionModeSource = new rxjs_1.BehaviorSubject(null)
    this.componentDefinitionMode = this.componentDefinitionModeSource.asObservable()
  }
  loadTypes() {
    return axios_observable_1.default.get(this.typesURL)
  }
  loadRoles() {
    return axios_observable_1.default.get(this.rolesURL)
  }
  loadRefinements(parent) {
    let params = new URLSearchParams()
    params.append('parent', parent)
    return axios_observable_1.default.get(this.refinementsURL, { params: params })
  }
  loadInteractions() {
    return axios_observable_1.default.get(this.interactionsURL)
  }
  loadInteractionRoles() {
    return axios_observable_1.default.get(this.interactionRolesURL)
  }
  loadInteractionRoleRefinements(parent) {
    let params = new URLSearchParams()
    params.append('parent', parent)
    return axios_observable_1.default.get(this.interactionRoleRefinementURL, { params: params })
  }
  setSelectedStyleInfo(newInfo) {
    this.styleInfoSource.next(newInfo)
  }
  setSelectedGlyphInfo(newInfo) {
    this.glyphInfoSource.next(newInfo)
  }
  setSelectedInteractionInfo(newInfo) {
    this.interactionInfoSource.next(newInfo)
  }
  setSelectedModuleInfo(newInfo) {
    this.moduleInfoSource.next(newInfo)
  }
  setSelectedCombinatorialInfo(newInfo) {
    this.combinatorialInfoSource.next(newInfo)
  }
  setComponentDefinitionMode(newSetting) {
    this.componentDefinitionModeSource.next(newSetting)
  }
}
exports.MetadataService = MetadataService
