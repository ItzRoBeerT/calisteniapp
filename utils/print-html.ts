// Utilidades compartidas para exportar vistas HTML a PDF vía el diálogo
// de impresión del navegador (sin dependencias de PDF).

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function printHTML(html: string): void {
  // srcdoc (no blob:) para que el pie/cabecera del navegador no muestre una URL fea.
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;';
  iframe.srcdoc = html;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    const cw = iframe.contentWindow;
    if (!cw) {
      document.body.removeChild(iframe);
      return;
    }

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    };

    cw.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 10_000);
    cw.print();
  };
}
