// Cache desactivado
export const useServiciosCache = () => ({ get: () => null, set: () => {}, invalidate: () => {}, invalidateType: () => {}, clear: () => {}, getStats: () => ({ hits: 0, misses: 0, entries: 0, size: "0 KB" }), getHitRate: () => 0 });
export default { get: () => null, set: () => {}, invalidate: () => {}, invalidateType: () => {}, clear: () => {}, getStats: () => ({ hits: 0, misses: 0, entries: 0, size: "0 KB" }), getHitRate: () => 0 };
