import React from 'react'
import CDSInline from '../images/big-icons/CDS-inline.svg'
import CDSReverseComplement from '../images/big-icons/CDS-reverseComplement.svg'
import AptamerInline from '../images/big-icons/aptamer-inline.svg'
import AssemblyScarInline from '../images/big-icons/assembly-scar-inline.svg'
import BiopolymerBaseInline from '../images/big-icons/biopolymer-base-inline.svg'
import BluntRestrictionSiteInline from '../images/big-icons/blunt-restriction-site-inline.svg'
import DnaStabilityInline from '../images/big-icons/dna-stability-inline.svg'
import EngineeredRegionInline from '../images/big-icons/engineered-region-inline.svg'
import Insulator from '../images/big-icons/insulator.svg'
import NoGlyphAssignedInline from '../images/big-icons/no-glyph-assigned-inline.svg'
import NonCodingRnaGeneInline from '../images/big-icons/non-coding-rna-gene-inline.svg'
import OperatorInline from '../images/big-icons/operator-inline.svg'
import OriginOfReplicationInline from '../images/big-icons/origin-of-replication-inline.svg'
import OriginOfTransferInline from '../images/big-icons/origin-of-transfer-inline.svg'
import OverhangSite5Inline from '../images/big-icons/overhang-site-5-inline.svg'
import OverhangSite5ReverseComplement from '../images/big-icons/overhang-site-5-reverseComplement.svg'
import PolyAInline from '../images/big-icons/poly-a-inline.svg'
import PrimerBindingSiteInline from '../images/big-icons/primer-binding-site-inline.svg'
import PrimerBindingSiteReverseComplement from '../images/big-icons/primer-binding-site-reverseComplement.svg'
import PromoterInline from '../images/big-icons/promoter-inline.svg'
import PromoterReverseComplement from '../images/big-icons/promoter-reverseComplement.svg'
import ProteinInline from '../images/big-icons/protein-inline.svg'
import RecombinationSiteInline from '../images/big-icons/recombination-site-inline.svg'
import ResInline from '../images/big-icons/res-inline.svg'
import RestrictionSiteInline from '../images/big-icons/restriction-site-inline.svg'
import RnaInline from '../images/big-icons/rna-inline.svg'
import SignatureInline from '../images/big-icons/signature-inline.svg'
import StickyRestrictionSite3Inline from '../images/big-icons/sticky-restriction-site-3-inline.svg'
import StickyRestrictionSite5Inline from '../images/big-icons/sticky-restriction-site-5-inline.svg'
import TerminatorInline from '../images/big-icons/terminator-inline.svg'
import UnspecifiedInline from '../images/big-icons/unspecified-inline.svg'

const ICON_MAPPING = {
  'CDS-inline': CDSInline,
  'CDS-reverseComplement': CDSReverseComplement,
  'aptamer-inline': AptamerInline,
  'assembly-scar-inline': AssemblyScarInline,
  'biopolymer-base-inline': BiopolymerBaseInline,
  'blunt-restriction-site-inline': BluntRestrictionSiteInline,
  'dna-stability-inline': DnaStabilityInline,
  'engineered-region-inline': EngineeredRegionInline,
  insulator: Insulator,
  'no-glyph-assigned-inline': NoGlyphAssignedInline,
  'non-coding-rna-gene-inline': NonCodingRnaGeneInline,
  'operator-inline': OperatorInline,
  'origin-of-replication-inline': OriginOfReplicationInline,
  'origin-of-transfer-inline': OriginOfTransferInline,
  'overhang-site-5-inline': OverhangSite5Inline,
  'overhang-site-5-reverseComplement': OverhangSite5ReverseComplement,
  'poly-a-inline': PolyAInline,
  'primer-binding-site-inline': PrimerBindingSiteInline,
  'primer-binding-site-reverseComplement': PrimerBindingSiteReverseComplement,
  'promoter-inline': PromoterInline,
  'promoter-reverseComplement': PromoterReverseComplement,
  'protein-inline': ProteinInline,
  'recombination-site-inline': RecombinationSiteInline,
  'res-inline': ResInline,
  'restriction-site-inline': RestrictionSiteInline,
  'rna-inline': RnaInline,
  'signature-inline': SignatureInline,
  'sticky-restriction-site-3-inline': StickyRestrictionSite3Inline,
  'sticky-restriction-site-5-inline': StickyRestrictionSite5Inline,
  'terminator-inline': TerminatorInline,
  'unspecified-inline': UnspecifiedInline,
}

export default function SymbolSVG({ role, orientation }) {
  let Icon = ICON_MAPPING[`${role}-${orientation}`]
  if (!Icon) {
    console.warn(`Missing icon for role = "${role}"!`)
    Icon = () => <path d="M0,0 L190,160 M190,0 L0,160" stroke="black" strokeWidth="2" />
  }
  return (
    <svg width="190px" height="160px">
      <path d="M0,80 L190,80" stroke="black" strokeWidth="2.2" />
      <Icon x={40} viewBox="0 40 100 80" />
    </svg>
  )
}
