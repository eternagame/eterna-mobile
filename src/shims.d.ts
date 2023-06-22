declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module "*.png";

declare module 'vue2-flip-countdown' {
  import { ExtendedVue } from 'vue/types/vue';
  const FlipCountdown: ExtendedVue<Vue, {}, {}, {}, {}>;
  export default FlipCountdown;
}

declare function plausible(eventName: string, options?: {u?: string, props: Record<string, string | number | boolean>}): void;
