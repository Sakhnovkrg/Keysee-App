import { ref } from "vue";

export interface Ripple {
  id: number;
  x: number;
  y: number;
  btn?: string;
}

export function useRipple() {
  const clickRipples = ref<Ripple[]>([]);
  let rippleId = 0;

  function handleRipple(data: { x: number; y: number; btn?: string }, duration: number) {
    const id = rippleId++;
    const { x, y, btn } = data;

    clickRipples.value.push({
      id,
      x: x / window.devicePixelRatio,
      y: y / window.devicePixelRatio,
      btn,
    });

    if (clickRipples.value.length > 30) {
      clickRipples.value.shift();
    }

    setTimeout(() => {
      clickRipples.value = clickRipples.value.filter((r) => r.id !== id);
    }, duration);
  }

  return {
    clickRipples,
    handleRipple,
  };
}
