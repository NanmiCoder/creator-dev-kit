import teamLead from '../assets/whales/team-lead.png'
import researcher from '../assets/whales/researcher.png'
import engineer from '../assets/whales/engineer.png'
import securityReviewer from '../assets/whales/security-reviewer.png'

/** Whale mascot art bundled into the module graph so single-file builds inline them. */
export const WHALES: Record<string, string> = {
  'team-lead': teamLead,
  researcher,
  engineer,
  'security-reviewer': securityReviewer,
}
