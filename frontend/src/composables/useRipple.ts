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

  function handleRipple(data: any, duration: number) {
    const { x, y, btn } = data;
    const id = rippleId++;
    clickRipples.value.push({ id, x, y, btn });
    if (clickRipples.value.length > 30) {
      clickRipples.value.shift()
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
