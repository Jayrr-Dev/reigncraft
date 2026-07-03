/**
 * Copy and routes for the World plaza beta site announcement.
 *
 * @module components/world/domains/definingWorldPlazaPromoAnnouncementConstants
 */

/** Route for the World plaza page. */
export const ROUTING_WORLD_PLAZA_PAGE_HREF = "/world" as const;

/** HTML for the World plaza beta site banner (admin seed default). */
export const LABELING_WORLD_PLAZA_PROMO_BANNER_MESSAGE_HTML =
  "<strong>World plaza is in beta.</strong> Walk an isometric map with up to 20 players per room. Registered accounts only. Sign in to join.";

/** Primary CTA label linking to the World plaza page. */
export const LABELING_WORLD_PLAZA_PROMO_BANNER_CTA = "Open World plaza";

/** Feature flag key gating the World plaza promo alongside the beta banner switch. */
export const FLAGGING_WORLD_PLAZA_PROMO_BANNER_KEY =
  "world_plaza_promo_banner" as const;

/** Short beta label for the World page header. */
export const LABELING_WORLD_PLAZA_BETA_BADGE = "Beta" as const;

/** World page intro explaining registered-only access. */
export const LABELING_WORLD_PLAZA_REGISTERED_ONLY_INTRO =
  "Early access for registered accounts. Sign in to enter the online plaza and play with others." as const;

/** Sign-in gate title for signed-out visitors. */
export const LABELING_WORLD_PLAZA_SIGN_IN_GATE_TITLE =
  "Sign in to enter World plaza" as const;

/** Sign-in gate body for signed-out visitors. */
export const LABELING_WORLD_PLAZA_SIGN_IN_GATE_BODY =
  "World plaza is in beta and limited to registered accounts. Sign in to walk the map with up to 20 players per room." as const;
