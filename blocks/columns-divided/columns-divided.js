/**
 * columns-divided: equal columns (heading + list/text + link) separated by
 * vertical rules. `four-columns` lays a row out as four columns on desktop.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const maxCols = Math.max(...rows.map((row) => row.children.length), 1);
  block.classList.add(`columns-divided-${maxCols}-cols`);

  rows.forEach((row) => {
    row.classList.add('columns-divided-row');
    const cells = [...row.children];
    cells.forEach((cell) => {
      cell.classList.add('columns-divided-col');
      if (!cell.textContent.trim() && !cell.querySelector('picture, img')) {
        cell.classList.add('columns-divided-col-empty');
      }
      const onlyPicture = cell.querySelector('picture') && !cell.textContent.trim();
      if (onlyPicture) cell.classList.add('columns-divided-img-col');
    });
  });
}
