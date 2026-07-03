// Devvit webviews disallow `unsafe-eval`; must run before any Pixi import.
import "pixi.js/unsafe-eval";

import { extend } from "@pixi/react";
import { Container, Graphics, Sprite } from "pixi.js";

/**
 * Registers Pixi display objects used by world scenes with `@pixi/react`.
 * Import this module once before rendering any `<pixi* />` components.
 */
extend({
  Container,
  Graphics,
  Sprite,
});
