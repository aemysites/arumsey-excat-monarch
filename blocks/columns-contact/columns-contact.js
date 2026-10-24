export default function decorate(block) {
  const rows = [...block.children];
  const colCount = Math.max(0, ...rows.map((row) => row.children.length));
  if (colCount) block.classList.add(`columns-contact-${colCount}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-contact-row');
    [...row.children].forEach((col) => {
      col.classList.add('columns-contact-col');
      if (!col.textContent.trim() && !col.querySelector('picture, img, span.icon')) {
        col.classList.add('columns-contact-col-empty');
      }

      // tag contact links so the design pass can style phone/email entries
      col.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        if (href.startsWith('tel:')) link.classList.add('columns-contact-phone');
        else if (href.startsWith('mailto:')) link.classList.add('columns-contact-email');
      });

      // an icon/image authored alone in a paragraph joins the following text paragraph
      col.querySelectorAll(':scope > p').forEach((p) => {
        const media = p.firstElementChild;
        const next = p.nextElementSibling;
        if (!media || p.children.length !== 1 || p.textContent.trim()) return;
        if (!media.matches('picture, span.icon, img')) return;
        if (!next || next.tagName !== 'P' || !next.textContent.trim()) return;
        if (next.querySelector('picture, span.icon, img')) return;
        next.prepend(media);
        p.remove();
      });

      // image option: an icon placed directly before a link/text shares its line
      col.querySelectorAll('p').forEach((p) => {
        const first = p.firstElementChild;
        if (first && (first.matches('picture, span.icon, img')) && p.textContent.trim()) {
          p.classList.add('columns-contact-icon-line');
        }
      });
    });
  });
}
