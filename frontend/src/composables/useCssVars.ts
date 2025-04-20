import { Settings } from './useSettings'

export function useCssVars() {
  function applyFromSettings(settings: Settings) {
    const root = document.documentElement

    const map: Record<string, string | number> = {
      '--font-family': settings.fontFamily,
      '--bg': settings.overlayBackground,
      '--bg-transparency': settings.overlayTransparency,
      '--key-border-radius': settings.keyBorderRadius,
      '--overlay-border-radius': settings.overlayBorderRadius,
      '--font-size': settings.fontSize,

      '--key-event-bg': settings.singleKeyBgColor,
      '--combo-event-bg': settings.comboKeyBgColor,
      '--mouse-event-bg': settings.mouseBgColor,

      '--key-event-color': settings.singleKeyTextColor,
      '--combo-event-color': settings.comboKeyTextColor,
      '--mouse-event-color': settings.mouseTextColor,

      '--event-transparency': settings.keyBackgroundTransparency,

      '--ripple-size': settings.rippleSize,
      '--ripple-duration': settings.rippleDuration,
      '--ripple-left': settings.rippleColorLeft,
      '--ripple-right': settings.rippleColorRight,
      '--ripple-middle': settings.rippleColorMiddle,
      '--ripple-transparency': settings.rippleTransparency,

      '--bottom-offset': settings.overlayBottomOffset,
      '--side-offset': settings.overlaySideOffset,
    }

    for (const [key, value] of Object.entries(map)) {
      root.style.setProperty(key, String(value))
    }

    const positionMap: Record<string, string> = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    }

    root.style.setProperty('--overlay-position', positionMap[settings.overlayPosition])
  }

  return { applyFromSettings }
}
