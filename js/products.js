/**
 * products.js — Catálogo de la tienda.
 *
 * IMPORTANTE: los productos y precios son DE EJEMPLO (no son los reales de la tienda).
 * Para escalar a React/Next.js, este archivo se convierte en una API o CMS sin cambiar el resto.
 *
 * cat: "asfalto" | "trail" | "textil" | "accesorios"
 * icon: clave de ICONS (dibujo SVG provisional hasta tener fotos reales)
 * Cuando haya fotos reales, añade `image: "img/producto.jpg"` y se usará en lugar del icono.
 */
window.ICONS = {
  shoe: '<path d="M8 58c0-8 6-10 12-12l14-10c4-3 8-2 11 1l6 7 22 8c10 3 17 6 17 14v4H8z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M8 66h92" stroke="currentColor" stroke-width="3"/>',
  vest: '<path d="M40 10c-6 4-12 8-18 10v44c0 4 3 6 6 6h64c3 0 6-2 6-6V20c-6-2-12-6-18-10-5 6-15 6-20 0-5 6-15 6-20 0z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M42 30v36M78 30v36" stroke="currentColor" stroke-width="3"/>',
  tee: '<path d="M38 12l-24 12 8 18 12-4v36h52V38l12 4 8-18L82 12c-4 8-10 12-22 12S42 20 38 12z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>',
  poles: '<path d="M30 10l20 62M70 10l20 62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="70" cy="10" r="5" fill="none" stroke="currentColor" stroke-width="3"/>',
  cap: '<path d="M20 42c0-18 18-28 40-28s40 10 40 28v6H20z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M20 48c-8 2-14 6-14 12h54" fill="none" stroke="currentColor" stroke-width="3"/>',
  light: '<circle cx="60" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M60 10v14M60 56v14M30 40h14M76 40h14M38 18l10 10M72 52l10 10M82 18L72 28M48 52L38 62" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  jacket: '<path d="M40 10L18 22v46h20V40h44v28h20V22L80 10c-4 6-10 8-20 8S44 16 40 10z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M60 18v50" stroke="currentColor" stroke-width="3"/>',
  gel: '<rect x="42" y="14" width="36" height="56" rx="8" fill="none" stroke="currentColor" stroke-width="3"/><path d="M50 14V8h20v6M42 34h36" stroke="currentColor" stroke-width="3"/>'
};

window.PRODUCTS = [
  { id: 1,  name: "Zapatilla trail técnica",     cat: "trail",      price: 139.95, sizes: ["40","41","42","43","44"], icon: "shoe",   badge: "Novedad",  desc: "Suela con tacos agresivos para terreno técnico." },
  { id: 2,  name: "Zapatilla running amortiguada", cat: "asfalto",  price: 129.95, sizes: ["39","40","41","42","43"], icon: "shoe",   badge: "Top ventas", desc: "Amortiguación cómoda para tus rodajes largos." },
  { id: 3,  name: "Chaleco de hidratación 10L",  cat: "accesorios", price: 89.95,  sizes: ["S/M","L/XL"],             icon: "vest",   badge: "",         desc: "Ligero y estable, con bolsillos frontales." },
  { id: 4,  name: "Camiseta técnica transpirable", cat: "textil",   price: 34.95,  sizes: ["S","M","L","XL"],         icon: "tee",    badge: "",         desc: "Secado rápido y tacto suave en cada kilómetro." },
  { id: 5,  name: "Bastones plegables carbono",  cat: "accesorios", price: 99.95,  sizes: ["Única"],                  icon: "poles",  badge: "Novedad",  desc: "Compactos y muy ligeros para subir y bajar." },
  { id: 6,  name: "Chaqueta cortavientos",       cat: "textil",     price: 79.95,  sizes: ["S","M","L","XL"],         icon: "jacket", badge: "",         desc: "Protege del viento sin renunciar a la ligereza." },
  { id: 7,  name: "Frontal 350 lúmenes",         cat: "accesorios", price: 44.95,  sizes: ["Única"],                  icon: "light",  badge: "",         desc: "Luz potente para entrenar al amanecer o de noche." },
  { id: 8,  name: "Zapatilla trail ligera",      cat: "trail",      price: 119.95, sizes: ["40","41","42","43"],      icon: "shoe",   badge: "",         desc: "Agilidad y agarre para carreras de montaña." },
  { id: 9,  name: "Gorra running",               cat: "accesorios", price: 19.95,  sizes: ["Única"],                  icon: "cap",    badge: "",         desc: "Ligera, con protección solar y ajuste cómodo." },
  { id: 10, name: "Geles energéticos (pack 6)",  cat: "accesorios", price: 14.95,  sizes: ["Pack"],                   icon: "gel",    badge: "",         desc: "Energía rápida para tus tiradas largas y carreras." },
  { id: 11, name: "Zapatilla running competición", cat: "asfalto",  price: 169.95, sizes: ["40","41","42","43","44"], icon: "shoe",   badge: "Novedad",  desc: "Respuesta y ligereza para ir a por tu marca." },
  { id: 12, name: "Mallas térmicas",             cat: "textil",     price: 49.95,  sizes: ["S","M","L","XL"],         icon: "tee",    badge: "",         desc: "Calor justo para entrenar en los días fríos." }
];
